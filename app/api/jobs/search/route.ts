import { NextRequest, NextResponse } from 'next/server'
import { retrieveCV, embedText, cosineSimilarity } from '@/lib/rag'
import { ApifyClient } from 'apify-client'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN })

// Parse natural language into structured search params
async function parseQuery(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Parse this job search query into JSON. Return ONLY valid JSON, no markdown fences.
Schema: {"keyword": string, "country": string, "remote_only": boolean}
Examples:
- "ML internships in Dhaka open this month" → {"keyword":"machine learning intern","country":"Bangladesh","remote_only":false}
- "remote frontend jobs" → {"keyword":"frontend developer","country":"United States","remote_only":true}
Query: "${query}"`,
    })
    const text = (response.text ?? '').replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch {
    return { keyword: query, country: 'Bangladesh', remote_only: false }
  }
}

// Generate CV-grounded reasoning for why a job matches (or doesn't)
async function explainMatch(jobTitle: string, jobDesc: string, cvContext: string, fitScore: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Given this candidate's CV and a job, explain in ONE concise sentence (max 25 words) why this job is a ${fitScore}% match. Reference specific CV evidence. Be honest about gaps.

CV: ${cvContext.slice(0, 1500)}

Job: ${jobTitle}
${jobDesc.slice(0, 400)}

Reasoning (one sentence):`,
    })
    return (response.text ?? '').trim()
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, query } = await req.json()
    if (!userId || !query?.trim()) {
      return NextResponse.json({ error: 'Missing userId or query' }, { status: 400 })
    }

    // 1. Parse the natural language query
    const parsed = await parseQuery(query)

    // 2. Get CV context for fit scoring + reasoning
    const cvChunks = await retrieveCV(userId, parsed.keyword, 6)
    const cvSummary = cvChunks.map(c => c.content).join(' ').slice(0, 1500)
    const cvVector = cvSummary ? await embedText(cvSummary) : []

    // 3. Search jobs via Apify
    let rawJobs: any[] = []
    try {
      const run = await apify.actor('jpraRc4MCUh5ehbHV').call({
        keyword:      parsed.keyword,
        country:      parsed.country || 'United States',
        max_results:  10,
        platforms:    [],
        remote_only:  parsed.remote_only ?? false,
        distance:     200,
        posted_since: '1 month',
        job_type:     'all',
        currency:     'USD',
      })
      const { items } = await apify.dataset(run.defaultDatasetId).listItems()
      rawJobs = items ?? []
    } catch (err) {
      console.error('[Jobs] Apify error:', err)
      return NextResponse.json({ jobs: [], parsed, message: 'Job search failed. Check Apify token.' })
    }

    if (rawJobs.length === 0) {
      return NextResponse.json({ jobs: [], parsed, message: 'No jobs found. Try different keywords.' })
    }

    // 4. Score + explain each job (top 8)
    const scored = await Promise.all(
      rawJobs.slice(0, 8).map(async (job: any) => {
        const jobTitle = job.title ?? 'Untitled'
        const jobDesc  = job.description ?? job.summary ?? ''

        // Programmatic fit score via cosine similarity
        let fitScore = 50
        if (cvVector.length > 0) {
          const jdVec = await embedText([jobTitle, jobDesc].join(' ').slice(0, 800))
          const raw   = cosineSimilarity(jdVec, cvVector)
          fitScore    = Math.round(((raw + 1) / 2) * 100)
        }

        // CV-grounded reasoning
        const reasoning = cvSummary
          ? await explainMatch(jobTitle, jobDesc, cvSummary, fitScore)
          : null

        return {
          id:          job.id ?? Math.random().toString(36).slice(2),
          title:       jobTitle,
          company:     job.company ?? job.employer ?? job.company_name ?? 'Unknown',
          location:    job.location ?? job.city ?? parsed.country,
          salary:      job.salary ?? job.salary_range ?? job.compensation ?? 'Not listed',
          deadline:    job.deadline ?? job.application_deadline ?? null,
          url:         job.url ?? job.job_url ?? job.link ?? '#',
          description: jobDesc.slice(0, 300),
          postedAt:    job.date_posted ?? job.posted_at ?? job.posted_date ?? null,
          fitScore,
          reasoning,
        }
      })
    )

    return NextResponse.json({
      jobs: scored.sort((a, b) => b.fitScore - a.fitScore),
      parsed,
    })

  } catch (err) {
    console.error('[Jobs API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
