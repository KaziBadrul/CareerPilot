'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, Trash2, Bot, User, Target, TrendingUp, Map, FileText } from 'lucide-react'

type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean }

// The four benchmark query types from the spec, as quick-action buttons
const QUICK_ACTIONS = [
  { icon: Target,     label: 'Am I ready?',      prompt: 'Am I ready for a junior data engineer role? Give me a verdict with reasoning.' },
  { icon: TrendingUp, label: 'Skill gaps',        prompt: 'What skills am I missing for a Google software engineering internship?' },
  { icon: Map,        label: '3-month roadmap',   prompt: 'Build me a 3-month roadmap to become job-ready, with weekly milestones and learning resources.' },
  { icon: FileText,   label: 'Cover letter',      prompt: 'Draft a cover letter for a machine learning internship at a tech startup.' },
]

export function ChatWindow({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch(`/api/assistant?userId=${userId}`)
      .then(r => r.json())
      .then(({ messages: hist }) => { if (hist?.length) setMessages(hist.map((m: any) => ({ id: m.id, role: m.role, content: m.content }))) })
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [userId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput(''); setLoading(true)

    const userMsg:      Message = { id: `u-${Date.now()}`, role: 'user',      content: trimmed }
    const assistantMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', content: '', streaming: true }
    setMessages(prev => [...prev, userMsg, assistantMsg])

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: trimmed }),
      })
      if (!res.ok || !res.body) throw new Error('Request failed')
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: acc } : m))
      }
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, streaming: false } : m))
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: 'Something went wrong. Please try again.', streaming: false } : m))
    } finally {
      setLoading(false); inputRef.current?.focus()
    }
  }, [userId, loading])

  const clearHistory = async () => {
    if (!confirm('Clear all chat history?')) return
    await fetch('/api/assistant', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
    setMessages([])
  }

  const renderContent = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>')
      .replace(/^### (.*)/gm, '<h3 style="font-weight:600;margin:12px 0 4px;font-size:0.9rem;color:#fff">$1</h3>')
      .replace(/^## (.*)/gm,  '<h2 style="font-weight:600;margin:14px 0 6px;font-size:0.95rem;color:#fff">$1</h2>')
      .replace(/^# (.*)/gm,   '<h1 style="font-weight:600;margin:14px 0 6px;font-size:1rem;color:#fff">$1</h1>')
      .replace(/^[-•] (.*)/gm, '<li style="margin-left:18px;margin-bottom:3px;list-style:disc">$1</li>')
      .replace(/^\d+\. (.*)/gm, '<li style="margin-left:18px;margin-bottom:3px;list-style:decimal">$1</li>')
      .replace(/\n/g, '<br/>')

  if (loadingHistory) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <Loader2 size={20} color="var(--muted)" className="animate-spin" />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color="var(--blue-light)" />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--white)', margin: 0 }}>CareerPilot AI</p>
                <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>I know your CV — ask me anything</p>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '18px' }}>
              I can assess your job readiness, find your skill gaps, build a learning roadmap, or draft a cover letter — all grounded in your actual CV.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }) => (
                <button key={label} onClick={() => send(prompt)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="var(--blue-light)" />
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--cream)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '10px', maxWidth: '760px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', marginLeft: msg.role === 'user' ? 'auto' : 0, width: '100%' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? 'var(--blue)' : 'rgba(255,255,255,0.06)', border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none' }}>
              {msg.role === 'user' ? <User size={12} color="#fff" /> : <Bot size={12} color="var(--muted)" />}
            </div>
            <div style={{ borderRadius: '12px', padding: '10px 14px', fontSize: '13.5px', maxWidth: '85%', background: msg.role === 'user' ? 'var(--blue)' : 'rgba(255,255,255,0.03)', border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none', color: msg.role === 'user' ? '#fff' : 'var(--cream)', lineHeight: 1.65 }}>
              {msg.role === 'user'
                ? <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                : <div dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />}
              {msg.streaming && <span className="cursor-blink" style={{ marginLeft: '2px' }} />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', maxWidth: '760px', margin: '0 auto' }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
            placeholder="Ask anything about your career…" rows={1} disabled={loading}
            style={{ flex: 1, resize: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-2)', borderRadius: '10px', padding: '10px 14px', color: 'var(--cream)', fontSize: '13.5px', outline: 'none', fontFamily: 'var(--font-body)', maxHeight: '120px', opacity: loading ? 0.5 : 1 }}
            onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-2)')} />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ width: '36px', height: '36px', background: input.trim() && !loading ? 'var(--blue)' : 'rgba(37,99,235,0.3)', border: 'none', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
            {loading ? <Loader2 size={14} color="#fff" className="animate-spin" /> : <Send size={14} color="#fff" />}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '760px', margin: '8px auto 0' }}>
          <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>Enter to send · Shift+Enter for new line</p>
          {messages.length > 0 && (
            <button onClick={clearHistory} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <Trash2 size={10} /> Clear history
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
