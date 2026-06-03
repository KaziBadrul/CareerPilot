import { NextRequest } from 'next/server'
import { retrieveCV, buildCVContext } from '@/src/lib/rag'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const MEMORY_WINDOW = 12

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json()
    if (!userId || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing userId or message' }), { status: 400 })
    }

    // Get relevant CV chunks
    const chunks = await retrieveCV(userId, message, 6)
    const cvContext = buildCVContext(chunks)

    // Load session memory
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MEMORY_WINDOW)

    const sessionHistory = (history ?? []).reverse()

    // Build chat history for Gemini
    const chatHistory = sessionHistory.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const systemPrompt = `You are CareerPilot, a personal AI career assistant. The user's CV is your single source of truth — never invent skills or experience not present in it.

━━━ USER CV (most relevant sections) ━━━
${cvContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Help with: job readiness verdicts, skill gap analysis, learning roadmaps, cover letter drafting, career advice. Always cite which CV section you're drawing from. Use markdown — it renders properly.`

    let fullResponse = ''

    // Stream response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash',
            contents: [
              ...chatHistory,
              { role: 'user', parts: [{ text: message }] }
            ],
            config: { systemInstruction: systemPrompt }
          })

          for await (const chunk of response) {
            const text = chunk.text ?? ''
            if (text) {
              fullResponse += text
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
        } finally {
          // Save to DB for session memory
          await supabase.from('chat_messages').insert([
            { user_id: userId, role: 'user',      content: message },
            { user_id: userId, role: 'assistant', content: fullResponse },
          ])
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
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