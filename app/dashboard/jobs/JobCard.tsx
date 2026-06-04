'use client'

import { useState } from 'react'
import { ExternalLink, BookmarkPlus, FileText, MapPin, DollarSign, Calendar, Loader2, Check, Sparkles } from 'lucide-react'

type Job = {
  id: string; title: string; company: string; location: string | null
  salary: string; deadline: string | null; url: string
  description: string | null; postedAt: string | null
  fitScore: number; reasoning: string | null
}

function fitColor(s: number) {
  if (s >= 75) return { bg: 'rgba(5,150,105,0.12)', text: '#34d399', ring: 'rgba(5,150,105,0.3)', label: 'Strong fit' }
  if (s >= 50) return { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', ring: 'rgba(245,158,11,0.3)', label: 'Partial fit' }
  return { bg: 'rgba(239,68,68,0.12)', text: '#f87171', ring: 'rgba(239,68,68,0.3)', label: 'Low fit' }
}

export function JobCard({ job, userId }: { job: Job; userId: string }) {
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [letter, setLetter]   = useState('')
  const [loadingLetter, setLoadingLetter] = useState(false)
  const [showLetter, setShowLetter] = useState(false)

  const c = fitColor(job.fitScore)

  const save = async () => {
    if (saving || saved) return
    setSaving(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobTitle: job.title, company: job.company, jobUrl: job.url, fitScore: job.fitScore, status: 'applied' }),
      })
      if (res.ok) setSaved(true)
    } finally { setSaving(false) }
  }

  const genLetter = async () => {
    if (letter) { setShowLetter(true); return }
    setLoadingLetter(true); setShowLetter(true)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: `Draft a cover letter for this job:\nRole: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${job.description}\n\nPersonalise to my CV, 3 paragraphs.` }),
      })
      if (!res.body) throw new Error()
      const reader = res.body.getReader(); const dec = new TextDecoder(); let t = ''
      while (true) { const { done, value } = await reader.read(); if (done) break; t += dec.decode(value, { stream: true }); setLetter(t) }
    } catch { setLetter('Failed to generate. Try again.') }
    finally { setLoadingLetter(false) }
  }

  const btn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: '6px 11px', borderRadius: '7px', border: '1px solid var(--border-2)', cursor: 'pointer', fontFamily: 'var(--font-body)', background: 'rgba(255,255,255,0.03)', color: 'var(--muted)' }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--white)', margin: '0 0 3px' }}>{job.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>{job.company}</p>
          </div>
          {/* Fit score badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: c.bg, border: `1px solid ${c.ring}`, borderRadius: '10px', padding: '6px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: c.text, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{job.fitScore}%</span>
            <span style={{ fontSize: '9.5px', color: c.text, opacity: 0.8, marginTop: '2px' }}>{c.label}</span>
          </div>
        </div>

        {/* Structured meta fields */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '12px' }}>
          {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--muted)' }}><MapPin size={11} />{job.location}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--muted)' }}><DollarSign size={11} />{job.salary}</span>
          {job.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#fbbf24' }}><Calendar size={11} />Deadline: {job.deadline}</span>}
        </div>

        {/* CV-grounded reasoning — the key spec requirement */}
        {job.reasoning && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', padding: '10px 12px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '8px' }}>
            <Sparkles size={13} color="var(--blue-light)" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '12px', color: 'var(--cream)', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>{job.reasoning}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ ...btn, color: 'var(--blue-light)', borderColor: 'rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.08)' }}>
            <ExternalLink size={11} /> View job
          </a>
          <button onClick={save} disabled={saving || saved} style={{ ...btn, ...(saved ? { color: '#34d399', borderColor: 'rgba(5,150,105,0.3)', background: 'rgba(5,150,105,0.08)' } : {}) }}>
            {saving ? <Loader2 size={11} className="animate-spin" /> : saved ? <Check size={11} /> : <BookmarkPlus size={11} />}
            {saved ? 'Saved' : 'Save to tracker'}
          </button>
          <button onClick={genLetter} style={{ ...btn, marginLeft: 'auto' }}>
            <FileText size={11} /> Cover letter
          </button>
        </div>
      </div>

      {/* Cover letter panel */}
      {showLetter && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)', margin: 0 }}>Cover letter draft</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {letter && <button onClick={() => navigator.clipboard.writeText(letter)} style={{ fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Copy</button>}
              <button onClick={() => setShowLetter(false)} style={{ fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Hide</button>
            </div>
          </div>
          {loadingLetter && !letter
            ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--muted)' }}><Loader2 size={12} className="animate-spin" />Drafting…</div>
            : <div style={{ fontSize: '12.5px', color: 'var(--cream)', lineHeight: 1.7, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', whiteSpace: 'pre-wrap', border: '1px solid var(--border)' }}>{letter}{loadingLetter && <span className="cursor-blink" />}</div>}
        </div>
      )}
    </div>
  )
}
