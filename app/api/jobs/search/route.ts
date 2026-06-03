import { NextRequest, NextResponse } from 'next/server'
import { retrieveCV, embedText, cosineSimilarity } from '@/src/lib/rag'
import { ApifyClient } from 'apify-client'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN })

// Parse natural language query into structured form
async function parseQuery(query: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Parse this job search query. Return ONLY valid JSON, no markdown.
Schema: {"keyword":string,"country":string,"remote_only":boolean}
Examples:
- "ML internships in Bangladesh" → {"keyword":"machine learning intern","country":"Bangladesh","remote_only":false}
- "remote frontend jobs" → {"keyword":"frontend developer","country":"United States","remote_only":true}
- "data science jobs Dhaka" → {"keyword":"data science","country":"Bangladesh","remote_only":false}
Query: "${query}"`
      }],
      temperature: 0,
      max_tokens: 100,
    })
    return JSON.parse(completion.choices[0].message.content ?? '{}')
  } catch {
    return { keyword: query, country: 'Bangladesh', remote_only: false }
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

    // 2. Get CV embedding for fit scoring
    const cvChunks = await retrieveCV(userId, parsed.keyword, 5)
    const cvSummary = cvChunks.map((c: any) => c.content).join(' ').slice(0, 1000)
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
      return NextResponse.json({
        jobs: [],
        parsed,
        message: 'Job search failed. Check your Apify token.',
      })
    }

    if (rawJobs.length === 0) {
      return NextResponse.json({ jobs: [], parsed, message: 'No jobs found. Try different keywords.' })
    }

    // 4. Score each job against CV
    const scored = await Promise.all(
      rawJobs.slice(0, 8).map(async (job: any) => {
        let fitScore: number | null = null

        if (cvVector.length > 0) {
          const jobText = [job.title, job.description ?? job.summary ?? ''].join(' ').slice(0, 800)
          const jdVec  = await embedText(jobText)
          const raw    = cosineSimilarity(jdVec, cvVector)
          fitScore     = Math.round(((raw + 1) / 2) * 100)
        }

        return {
          id:          job.id        ?? Math.random().toString(36).slice(2),
          title:       job.title     ?? 'Untitled',
          company:     job.company   ?? job.employer ?? 'Unknown',
          location:    job.location  ?? parsed.country,
          salary:      job.salary    ?? job.compensation ?? 'Not listed',
          url:         job.url       ?? job.job_url ?? '#',
          description: (job.description ?? job.summary ?? '').slice(0, 300),
          postedAt:    job.date_posted ?? job.posted_at ?? null,
          deadline:    null,
          fitScore,
        }
      })
    )

    return NextResponse.json({
      jobs: scored.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0)),
      parsed,
    })

  } catch (err) {
    console.error('[Jobs API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}