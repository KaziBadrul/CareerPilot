'use client'

import { useState } from 'react'
import { JobCard } from './JobCard'
import { Search, Loader2, Briefcase, AlertCircle, Sparkles } from 'lucide-react'

type Job = {
  id: string; title: string; company: string; location: string | null
  salary: string; deadline: string | null; url: string
  description: string | null; postedAt: string | null
  fitScore: number; reasoning: string | null
}

const EXAMPLES = [
  'ML internships in Dhaka open this month',
  'Remote backend developer roles',
  'Data science jobs in Bangladesh',
  'Junior frontend engineer positions',
]

export function JobSearchPage({ userId, hasCV }: { userId: string; hasCV: boolean }) {
  const [query, setQuery]       = useState('')
  const [jobs, setJobs]         = useState<Job[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [parsed, setParsed]     = useState<any>(null)
  const [searched, setSearched] = useState(false)

  const search = async (q?: string) => {
    const sq = (q ?? query).trim()
    if (!sq || loading) return
    if (q) setQuery(q)
    setLoading(true); setError(''); setSearched(true)
    try {
      const res  = await fetch('/api/jobs/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, query: sq }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Search failed')
      setJobs(data.jobs ?? [])
      setParsed(data.parsed ?? null)
      if (data.message) setError(data.message)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--white)', margin: '0 0 4px' }}>Job hunter</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>Search in plain English — each result is scored and explained against your CV</p>
      </div>

      {!hasCV && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fbbf24', marginBottom: '20px' }}>
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          Upload your CV first so we can score and explain each job against your profile.
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
            placeholder='"ML internships in Dhaka open this month"'
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-2)', borderRadius: '10px', color: 'var(--cream)', fontSize: '13.5px', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-2)')} />
        </div>
        <button onClick={() => search()} disabled={!query.trim() || loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: query.trim() && !loading ? 'var(--blue)' : 'rgba(37,99,235,0.3)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: 500, cursor: query.trim() && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Search
        </button>
      </div>

      {!searched && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Try these</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {EXAMPLES.map(q => (
              <button key={q} onClick={() => search(q)} style={{ fontSize: '12px', color: 'var(--muted)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '100px', padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.4)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '48px 0', color: 'var(--muted)' }}>
          <Loader2 size={22} className="animate-spin" />
          <p style={{ fontSize: '13px', margin: 0 }}>Searching, scoring, and explaining matches…</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}>
          <Briefcase size={14} />{error}
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 12px' }}>
            <span style={{ color: 'var(--cream)', fontWeight: 500 }}>{jobs.length} jobs</span>
            {parsed && <> for "{parsed.keyword}"{parsed.country ? ` in ${parsed.country}` : ''}</>}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.map(job => <JobCard key={job.id} job={job} userId={userId} />)}
          </div>
        </>
      )}

      {!loading && searched && jobs.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
          <Briefcase size={24} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p style={{ fontSize: '13px', margin: 0 }}>No jobs found. Try broader keywords.</p>
        </div>
      )}
    </div>
  )
}
