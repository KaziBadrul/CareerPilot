'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Check } from 'lucide-react'

const PERKS = ['CV indexed in 30 seconds', 'AI grounded in your real experience', 'Free forever — no credit card']

export default function SignupPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setDone(true)
    } catch (err: any) {
      setError(err.message ?? 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--navy)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '20px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--cream)' }}>CareerPilot</span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--white)', margin: '0 0 6px' }}>
            Start for free
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Your career co-pilot is ready.</p>
        </div>

        {/* Perks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          {PERKS.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--muted)' }}>
              <Check size={12} color="var(--blue-light)" />
              {p}
            </div>
          ))}
        </div>

        {done ? (
          <div style={{
            background: 'rgba(5,150,105,0.08)',
            border: '1px solid rgba(5,150,105,0.25)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✉️</div>
            <p style={{ color: 'var(--cream)', fontSize: '15px', fontWeight: 500, margin: '0 0 6px' }}>Check your email</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>We sent a confirmation link to <strong style={{ color: 'var(--cream)' }}>{email}</strong></p>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-2)', borderRadius: '16px', padding: '28px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(['email', 'password'] as const).map(field => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '7px', letterSpacing: '0.04em' }}>
                    {field.toUpperCase()}
                  </label>
                  <input
                    type={field}
                    value={field === 'email' ? email : password}
                    onChange={e => field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                    required
                    placeholder={field === 'email' ? 'you@example.com' : '6+ characters'}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                      padding: '11px 14px', color: 'var(--cream)', fontSize: '14px',
                      outline: 'none', transition: 'border-color 0.2s',
                      fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              ))}

              {error && (
                <p style={{ fontSize: '12.5px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '7px', padding: '9px 12px', margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(37,99,235,0.6)' : 'var(--blue)',
                  color: '#fff', border: 'none', borderRadius: '8px', padding: '12px',
                  fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s', fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = 'var(--blue-glow)') }}
                onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = 'var(--blue)') }}
              >
                {loading ? 'Creating account…' : <>Create free account <ArrowRight size={14} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', margin: '20px 0 0' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--blue-light)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
