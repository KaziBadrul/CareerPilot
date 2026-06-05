import { NextRequest } from 'next/server'
import { retrieveCV, buildCVContext } from '@/lib/rag'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import Groq from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const MEMORY_WINDOW = 12

// System prompt that handles ALL FOUR benchmark query types from the spec
const SYSTEM_PROMPT = (cvContext: string) => `You are CareerPilot, a personal AI career assistant. The user's CV below is your single source of truth. NEVER invent skills, experience, or projects not present in it.

━━━ USER'S CV (most relevant sections) ━━━
${cvContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You must handle these four types of requests expertly:

1. JOB READINESS ("Am I ready for X role?")
   → Give a clear VERDICT (Ready / Almost ready / Not yet ready)
   → Back it with specific evidence from their CV
   → List what qualifies them and what's missing
   → Reference the job description if provided

2. SKILL GAP ANALYSIS ("What am I missing for X?")
   → Compare their CV against what the target role/company typically requires
   → Give a concrete list of MISSING skills, not generic advice
   → Prioritise gaps by importance
   → Note which existing skills are transferable

3. LEARNING ROADMAP ("Build me a 3-month roadmap")
   → Produce a structured WEEKLY plan (Week 1-2, Week 3-4, etc.)
   → Include specific learning resources (courses, docs, projects)
   → Tie each phase to a concrete milestone
   → Base the starting point on their current CV level

4. COVER LETTER ("Draft a cover letter for X")
   → Write a personalised 3-paragraph letter
   → Reference their ACTUAL projects and experience from the CV
   → Match it to the specific role/company
   → Professional but not generic

FORMATTING:
- Use markdown — headers (##), bold (**), bullets (-) all render
- Always cite which CV section evidence comes from (e.g. "from your Projects section…")
- Be specific and actionable. No filler.
- If the CV lacks info needed to answer, say so honestly rather than inventing.`

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json()
    if (!userId || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing userId or message' }), { status: 400 })
    }

    // Retrieve relevant CV chunks (more for roadmaps/cover letters which need full context)
    const needsFullContext = /roadmap|cover letter|ready|missing|gap/i.test(message)
    const topK = needsFullContext ? 8 : 6
    const chunks = await retrieveCV(userId, message, topK)
    const cvContext = buildCVContext(chunks)

    // Load session memory
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MEMORY_WINDOW)

    const sessionHistory = (history ?? []).reverse()
    const chatHistory = sessionHistory.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    let fullResponse = ''

    const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT(cvContext) },
            ...sessionHistory.map((m: any) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            { role: 'user', content: message },
          ],
          stream: true,
        })
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            fullResponse += text
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
      } catch (streamErr) {
        console.error('[Assistant stream]', streamErr)
        controller.enqueue(new TextEncoder().encode('Sorry, something went wrong.'))
      } finally {
        await supabase.from('chat_messages').insert([
          { user_id: userId, role: 'user', content: message },
          { user_id: userId, role: 'assistant', content: fullResponse },
        ])
        controller.close()
      }
    },
  })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
    })

  } catch (err) {
    console.error('[Assistant API]', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get('userId')
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })
  const { data } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50)
  return Response.json({ messages: data ?? [] })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json()
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 })
  await supabase.from('chat_messages').delete().eq('user_id', userId)
  return Response.json({ success: true })
}
