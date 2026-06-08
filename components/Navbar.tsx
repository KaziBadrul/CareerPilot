'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--surface-2)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '30px', height: '30px',
            // background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* <Zap size={15} color="#fff" /> */}
            {/* favicon icon as logo */}
            <img src="/favicon.ico" alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '8px' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '17px',
            color: 'var(--cream)',
            letterSpacing: '-0.02em',
          }}>
            CareerPilot
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 400,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden-mobile">
          <Link href="/login" style={{
            color: 'var(--muted)',
            textDecoration: 'none',
            fontSize: '14px',
          }}>
            Sign in
          </Link>
          <Link href="/signup" style={{
            background: 'var(--blue)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '8px 18px',
            borderRadius: '8px',
            transition: 'background 0.2s, transform 0.1s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-glow)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue)' }}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', padding: '4px' }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--navy-2)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px 24px',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', color: 'var(--muted)', padding: '10px 0', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid var(--border)' }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <Link href="/login" style={{ color: 'var(--cream)', textDecoration: 'none', fontSize: '15px', textAlign: 'center', padding: '10px', border: '1px solid var(--border-2)', borderRadius: '8px' }}>Sign in</Link>
            <Link href="/signup" style={{ background: 'var(--blue)', color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 500, textAlign: 'center', padding: '10px', borderRadius: '8px' }}>Get started free</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
