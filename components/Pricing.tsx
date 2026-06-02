'use client'
import Link from 'next/link'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    desc: 'Everything you need to get started.',
    features: [
      'CV upload & indexing',
      '10 AI assistant queries/day',
      '5 job searches/day',
      'Kanban tracker',
      'Goal setting',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '9',
    period: 'per month',
    desc: 'For serious job seekers.',
    features: [
      'Everything in Free',
      'Unlimited AI assistant',
      'Unlimited job searches',
      'Fit score explanations',
      'AI-generated roadmaps',
      'Priority nudge agent',
      'Cover letter history',
    ],
    cta: 'Start Pro free',
    href: '/signup?plan=pro',
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: '100px 24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', color: 'var(--blue-light)', marginBottom: '12px', textTransform: 'uppercase' }}>
          Pricing
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--white)',
          margin: '0 0 12px',
        }}>
          Simple, honest pricing
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>No credit card needed to start.</p>
      </div>

      {/* Plans */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        alignItems: 'start',
      }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            background: plan.highlighted ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${plan.highlighted ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '16px',
            padding: '32px',
            position: 'relative',
            boxShadow: plan.highlighted ? '0 0 40px rgba(37,99,235,0.12)' : 'none',
          }}>
            {plan.highlighted && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--blue)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '3px 12px',
                borderRadius: '100px',
                textTransform: 'uppercase',
              }}>
                Most popular
              </div>
            )}

            {/* Plan name */}
            <p style={{ fontSize: '12px', fontWeight: 500, color: plan.highlighted ? 'var(--blue-light)' : 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              {plan.name}
            </p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 700, color: 'var(--white)', lineHeight: 1 }}>
                ${plan.price}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{plan.period}</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 28px' }}>{plan.desc}</p>

            {/* CTA */}
            <Link href={plan.href} style={{
              display: 'block',
              textAlign: 'center',
              background: plan.highlighted ? 'var(--blue)' : 'rgba(255,255,255,0.06)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '11px 20px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                if (plan.highlighted) el.style.background = 'var(--blue-glow)'
                else el.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                if (plan.highlighted) el.style.background = 'var(--blue)'
                else el.style.background = 'rgba(255,255,255,0.06)'
              }}
            >
              {plan.cta}
            </Link>

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--cream)' }}>
                  <Check size={14} color={plan.highlighted ? 'var(--blue-light)' : 'var(--muted)'} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
