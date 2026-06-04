import { Upload, Cpu, Zap, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    icon: Upload,
    title: 'Upload your CV',
    desc: 'Drop a PDF or DOCX. Your CV is parsed, chunked by section, and embedded into a vector database in under 30 seconds.',
  },
  {
    icon: Cpu,
    title: 'AI indexes your profile',
    desc: 'Every agent — job search, assistant, fit scorer — retrieves your actual experience before generating any response. No hallucinations.',
  },
  {
    icon: Zap,
    title: 'Hunt, score, and apply',
    desc: 'Search in plain English. Get fit-scored job cards, one-click cover letters, and a gap analysis for any role you target.',
  },
  {
    icon: TrendingUp,
    title: 'Track your progress',
    desc: 'Kanban board, deadline calendar, and AI nudges keep you accountable. Your roadmap updates as you hit milestones.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" style={{
      padding: '100px 24px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', color: 'var(--blue-light)', marginBottom: '12px', textTransform: 'uppercase' }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--white)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            From CV to offer in four steps
          </h2>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0',
          position: 'relative',
        }}>
          {/* Connector line (desktop) */}
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '12.5%',
            right: '12.5%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), rgba(37,99,235,0.4), transparent)',
            pointerEvents: 'none',
          }} />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} style={{
                padding: '0 24px 0',
                textAlign: 'center',
                position: 'relative',
              }}>
                {/* Icon circle */}
                <div style={{
                  width: '56px', height: '56px',
                  background: 'var(--navy-3)',
                  border: '1px solid rgba(37,99,235,0.35)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 0 0 6px var(--navy)',
                }}>
                  <Icon size={20} color="var(--blue-light)" />
                  <div style={{
                    position: 'absolute',
                    top: '-1px', right: '-1px',
                    width: '18px', height: '18px',
                    background: 'var(--blue)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: 700, color: '#fff',
                    border: '2px solid var(--navy)',
                  }}>
                    {i + 1}
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--white)',
                  margin: '0 0 10px',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'var(--muted)',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
