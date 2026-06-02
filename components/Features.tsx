'use client'

import { Search, Brain, MessageSquare, BarChart3, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const FEATURES = [
  {
    icon: Search,
    number: '01',
    title: 'Job hunter agent',
    desc: 'Ask in plain English. The agent searches live job boards, scores each result against your CV, and explains why every match fits — or doesn\'t.',
    detail: 'Connects to Adzuna, filters by deadline, sorts by fit score.',
    color: '#2563eb',
  },
  {
    icon: Brain,
    number: '02',
    title: 'CV as source of truth',
    desc: 'Upload once. Your CV is chunked, embedded, and stored in a vector database. Every AI response is grounded in your actual experience — never hallucinated.',
    detail: 'RAG architecture with semantic search across sections.',
    color: '#7c3aed',
  },
  {
    icon: MessageSquare,
    number: '03',
    title: 'Personal AI assistant',
    desc: 'Ask anything about your career. Get gap analysis, a custom learning roadmap, a job-readiness verdict, or a cover letter — all tailored to your profile.',
    detail: 'Session memory, streaming responses, markdown rendering.',
    color: '#0891b2',
  },
  {
    icon: BarChart3,
    number: '04',
    title: 'Productivity tracker',
    desc: 'Kanban board, goal setting, calendar with deadlines, and a progress dashboard. The AI nudges you when you\'re falling behind.',
    detail: 'Drag-and-drop Kanban, streak tracking, AI reminders.',
    color: '#059669',
  },
]

export function Features() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="features" style={{
      padding: '100px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: 'var(--blue-light)',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          Four pillars
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--white)',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}>
          Everything a job seeker needs,<br />in one agentic platform
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
          Not just a chatbot. Four coordinated AI agents working on your behalf.
        </p>
      </div>

      {/* Feature grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          const isHovered = hovered === i
          return (
            <div
              key={f.number}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '16px',
                padding: '28px',
                cursor: 'default',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Number watermark */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                fontFamily: 'var(--font-display)',
                fontSize: '80px',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.03)',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {f.number}
              </div>

              {/* Icon */}
              <div style={{
                width: '42px', height: '42px',
                background: `${f.color}20`,
                border: `1px solid ${f.color}40`,
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
                transition: 'all 0.25s',
                boxShadow: isHovered ? `0 0 20px ${f.color}30` : 'none',
              }}>
                <Icon size={18} color={f.color} />
              </div>

              {/* Content */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--white)',
                margin: '0 0 10px',
                letterSpacing: '-0.01em',
              }}>
                {f.title}
              </h3>
              <p style={{
                color: 'var(--muted)',
                fontSize: '13.5px',
                lineHeight: 1.65,
                margin: '0 0 16px',
              }}>
                {f.desc}
              </p>
              <p style={{
                fontSize: '11.5px',
                color: isHovered ? f.color : 'rgba(255,255,255,0.25)',
                transition: 'color 0.25s',
                margin: 0,
              }}>
                {f.detail}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
