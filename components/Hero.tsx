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
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-[120px] pb-[80px] relative overflow-hidden bg-navy font-body">

      {/* Grid lines */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} 
      />

      <div className="max-w-[860px] w-full text-center relative z-10">

        {/* Badge */}
        <div className="animate-fadeUp inline-flex items-center gap-2 bg-green text-black border-[3px] border-black px-4 py-1.5 mb-8 text-xs font-black tracking-widest uppercase shadow-[2px_2px_0px_#0A0A0A]">
          <Sparkles size={14} strokeWidth={3} />
          POWERED BY AI AGENTS
        </div>

        {/* Headline */}
        <h1 className="animate-fadeUp delay-100 font-display text-[clamp(2.4rem,6vw,4.2rem)] font-black leading-[1.1] tracking-tight mb-6 text-white uppercase">
          The AI that{' '}
          <span className="text-blue underline decoration-[6px] underline-offset-4">hunts your next job</span>
          <br />
          while you sleep
        </h1>

        {/* Subhead */}
        <p className="animate-fadeUp delay-200 text-[clamp(1rem,2vw,1.15rem)] text-muted font-medium leading-[1.7] max-w-[600px] mx-auto mb-10">
          Upload your CV once. CareerPilot scores your fit, finds live jobs,
          drafts cover letters, and builds your learning roadmap — all grounded in your actual experience.
        </p>

        {/* CTA buttons */}
        <div className="animate-fadeUp delay-300 flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link href="/signup" 
            className="inline-flex items-center gap-2 bg-blue text-cream border-[3px] border-black text-[15px] font-black uppercase px-8 py-3.5 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all tracking-widest"
          >
            Start for free
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
          <a href="#features" 
            className="inline-flex items-center gap-2 bg-white text-black border-[3px] border-black text-[15px] font-black uppercase px-8 py-3.5 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all tracking-widest"
          >
            See how it works
          </a>
        </div>

        {/* Typing demo box */}
        <div className="animate-fadeUp delay-400 bg-surface border-[3px] border-black p-5 max-w-[580px] mx-auto text-left shadow-[8px_8px_0px_#0A0A0A]">
          <div className="flex items-center gap-2 mb-4 border-b-[3px] border-black pb-3">
            <div className="w-3 h-3 bg-black" />
            <div className="w-3 h-3 bg-black" />
            <div className="w-3 h-3 bg-black" />
            <span className="ml-2 text-xs text-muted font-mono font-bold uppercase tracking-widest">
              careerpilot — assistant
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[28px] h-[28px] bg-green border-[2px] border-black flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={14} color="#0A0A0A" strokeWidth={3} />
            </div>
            <p className="font-mono text-[14px] text-cream font-bold m-0 leading-[1.6] min-h-[22px]">
              {displayed}
              <span className="cursor-blink" />
            </p>
          </div>
        </div>

        {/* Social proof */}
        <p className="animate-fadeUp delay-500 mt-8 text-xs text-muted font-bold tracking-widest uppercase">
          Built for the Codesprint 2026 hackathon · Powered by Poridhi.io
        </p>

      </div>
    </section>
  )
}
