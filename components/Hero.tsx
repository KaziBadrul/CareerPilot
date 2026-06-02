'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const TYPING_PHRASES = [
  'Find ML internships in Dhaka open this month',
  'Am I ready for a Google SWE role?',
  'What skills am I missing for Meta?',
  'Draft a cover letter for this job',
  'Build me a 3-month roadmap to land a job',
]

export function Hero() {
  const [phraseIdx,  setPhraseIdx]  = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIdx,    setCharIdx]    = useState(0)

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx]
    let timeout: NodeJS.Timeout

    if (!isDeleting && charIdx <= phrase.length) {
      timeout = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx))
        setCharIdx(i => i + 1)
      }, charIdx === 0 ? 600 : 38)
    } else if (!isDeleting && charIdx > phrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx - 1))
        setCharIdx(i => i - 1)
      }, 18)
    } else {
      setIsDeleting(false)
      setPhraseIdx(i => (i + 1) % TYPING_PHRASES.length)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, isDeleting, phraseIdx])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'pulse-slow 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'pulse-slow 8s ease-in-out infinite 2s',
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
      }} />

      <div style={{ maxWidth: '860px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <div className="animate-fadeUp" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(37,99,235,0.12)',
          border: '1px solid rgba(37,99,235,0.3)',
          borderRadius: '100px',
          padding: '5px 14px',
          marginBottom: '28px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--blue-light)',
          letterSpacing: '0.04em',
        }}>
          <Sparkles size={12} />
          POWERED BY AI AGENTS
        </div>

        {/* Headline */}
        <h1 className="animate-fadeUp delay-100" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 20px',
          color: 'var(--white)',
        }}>
          The AI that{' '}
          <span className="shimmer-text">hunts your next job</span>
          <br />
          while you sleep
        </h1>

        {/* Subhead */}
        <p className="animate-fadeUp delay-200" style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'var(--muted)',
          fontWeight: 300,
          lineHeight: 1.7,
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          Upload your CV once. CareerPilot scores your fit, finds live jobs,
          drafts cover letters, and builds your learning roadmap — all grounded in your actual experience.
        </p>

        {/* CTA buttons */}
        <div className="animate-fadeUp delay-300" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '56px',
        }}>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--blue)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 500,
            padding: '13px 28px',
            borderRadius: '10px',
            transition: 'all 0.2s',
            boxShadow: '0 0 0 0 rgba(37,99,235,0)',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--blue-glow)'
              el.style.boxShadow = '0 0 24px rgba(37,99,235,0.4)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--blue)'
              el.style.boxShadow = '0 0 0 0 rgba(37,99,235,0)'
              el.style.transform = 'translateY(0)'
            }}
          >
            Start for free
            <ArrowRight size={15} />
          </Link>
          <a href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid var(--border-2)',
            color: 'var(--cream)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 400,
            padding: '13px 28px',
            borderRadius: '10px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.25)'
              el.style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border-2)'
              el.style.background = 'transparent'
            }}
          >
            See how it works
          </a>
        </div>

        {/* Typing demo box */}
        <div className="animate-fadeUp delay-400" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-2)',
          borderRadius: '14px',
          padding: '18px 24px',
          maxWidth: '580px',
          margin: '0 auto',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
              careerpilot — assistant
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '6px',
              background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '2px',
            }}>
              <Sparkles size={12} color="var(--blue-light)" />
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--cream)',
              margin: 0,
              lineHeight: 1.6,
              minHeight: '22px',
            }}>
              {displayed}
              <span className="cursor-blink" />
            </p>
          </div>
        </div>

        {/* Social proof */}
        <p className="animate-fadeUp delay-500" style={{
          marginTop: '28px',
          fontSize: '12px',
          color: 'var(--muted)',
          letterSpacing: '0.03em',
        }}>
          Built for the Codesprint 2026 hackathon · Powered by Poridhi.io
        </p>

      </div>
    </section>
  )
}
