'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px', height: '26px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={13} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--cream)',
          }}>
            CareerPilot
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { href: '#features',  label: 'Features' },
            { href: '#how',       label: 'How it works' },
            { href: '#pricing',   label: 'Pricing' },
            { href: '/login',     label: 'Sign in' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Built with */}
        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
          Built for Codesprint 2026 · Powered by{' '}
          <a href="https://poridhi.io" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--blue-light)', textDecoration: 'none' }}>
            Poridhi.io
          </a>
        </p>
      </div>
    </footer>
  )
}
