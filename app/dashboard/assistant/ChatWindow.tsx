'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, Trash2, Bot, User, Target, TrendingUp, Map, FileText } from 'lucide-react'

type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean }

const QUICK_ACTIONS = [
  { icon: Target,     label: 'Am I ready?',      accent: '#C8FF00', prompt: 'Am I ready for a junior data engineer role? Give me a verdict with reasoning.' },
  { icon: TrendingUp, label: 'Skill gaps',        accent: '#0047FF', prompt: 'What skills am I missing for a Google software engineering internship?' },
  { icon: Map,        label: '3-month roadmap',   accent: '#FF5500', prompt: 'Build me a 3-month roadmap to become job-ready, with weekly milestones and learning resources.' },
  { icon: FileText,   label: 'Cover letter',      accent: '#C8FF00', prompt: 'Draft a cover letter for a machine learning internship at a tech startup.' },
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
      .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:2px 5px;font-size:0.85em;font-weight:700;border:1px solid #0A0A0A">$1</code>')
      .replace(/^### (.*)/gm, '<h3 style="font-weight:900;margin:16px 0 6px;font-size:1.05rem;color:#0A0A0A;text-transform:uppercase">$1</h3>')
      .replace(/^## (.*)/gm,  '<h2 style="font-weight:900;margin:18px 0 8px;font-size:1.15rem;color:#0A0A0A;text-transform:uppercase">$1</h2>')
      .replace(/^# (.*)/gm,   '<h1 style="font-weight:900;margin:20px 0 10px;font-size:1.3rem;color:#0A0A0A;text-transform:uppercase">$1</h1>')
      .replace(/^[-•] (.*)/gm, '<li style="margin-left:18px;margin-bottom:4px;list-style:square;font-weight:500">$1</li>')
      .replace(/^\d+\. (.*)/gm, '<li style="margin-left:18px;margin-bottom:4px;list-style:decimal;font-weight:500">$1</li>')
      .replace(/\n/g, '<br/>')

  if (loadingHistory) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#FFFEF0' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={32} color="#C8FF00" className="animate-spin" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em' }}>
          LOADING ASSISTANT HISTORY...
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFEF0', color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Messages Viewport */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {messages.length === 0 && (
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', background: 'transparent', border: '3px solid #0A0A0A', padding: '32px', boxSizing: 'border-box', boxShadow: '5px 5px 0px #0A0A0A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '24px', background: '#C8FF00', border: '2px solid #0A0A0A' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>CareerPilot AI</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#555', margin: '0 0 24px', fontWeight: 500, lineHeight: 1.6 }}>
              I am fully sync'd with your index vault. Ask me anything to systematically navigate your career progression options or cross-examine credentials.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="content-grid">
              {QUICK_ACTIONS.map(({ icon: Icon, label, accent, prompt }) => (
                <button key={label} onClick={() => send(prompt)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left', 
                    background: 'transparent', border: '3px solid #0A0A0A', padding: '16px 20px', 
                    cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.1s',
                    boxShadow: '4px 4px 0px #0A0A0A'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #0A0A0A' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #0A0A0A' }}>
                  <div style={{ width: '36px', height: '36px', background: accent, border: '2px solid #0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={accent === '#C8FF00' ? '#0A0A0A' : '#FFFEF0'} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A0A0A', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} style={{ 
              display: 'flex', gap: '14px', maxWidth: '850px', 
              flexDirection: isUser ? 'row-reverse' : 'row', 
              marginLeft: isUser ? 'auto' : 0, width: '100%' 
            }}>
              {/* Profile Avatar Block */}
              <div style={{ 
                width: '36px', height: '36px', flexShrink: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: isUser ? '#0A0A0A' : '#0047FF', border: '2px solid #0A0A0A',
                boxShadow: '2px 2px 0px #0A0A0A'
              }}>
                {isUser ? <User size={14} color="#FFFEF0" /> : <Bot size={14} color="#FFFEF0" />}
              </div>
              
              {/* Message Bubble Block */}
              <div style={{ 
                border: '3px solid #0A0A0A', padding: '16px 20px', fontSize: '14px', maxWidth: '80%', 
                background: 'transparent',
                color: '#0A0A0A', lineHeight: 1.6,
                boxShadow: '4px 4px 0px #0A0A0A',
                boxSizing: 'border-box'
              }}>
                {isUser
                  ? <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontWeight: 600 }}>{msg.content}</p>
                  : <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />}
                {msg.streaming && <span className="cursor-blink" style={{ marginLeft: '4px', display: 'inline-block', width: '6px', height: '14px', background: '#0A0A0A' }} />}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input Control Deck */}
      <div style={{ borderTop: '3px solid #0A0A0A', padding: '24px 40px', background: 'transparent' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', maxWidth: '850px', margin: '0 auto' }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
            placeholder="Ask anything about your career…" rows={1} disabled={loading}
            style={{ 
              flex: 1, resize: 'none', background: 'transparent', border: '3px solid #0A0A0A', 
              padding: '14px 18px', color: '#0A0A0A', fontSize: '14px', fontWeight: 600, outline: 'none', 
              fontFamily: "'Space Grotesk', sans-serif", maxHeight: '120px', opacity: loading ? 0.6 : 1,
              boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.05)'
            }}
            onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px' }}
            onFocus={e => (e.currentTarget.style.background = 'rgba(200,255,0,0.02)')}
            onBlur={e => (e.currentTarget.style.background = 'transparent')} />
          
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ 
              width: '50px', height: '50px', 
              background: input.trim() && !loading ? '#C8FF00' : '#EAE9E0', 
              border: '3px solid #0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0,
              boxShadow: input.trim() && !loading ? '3px 3px 0px #0A0A0A' : 'none',
              transition: 'all 0.1s'
            }}
            onMouseEnter={e => { if(input.trim() && !loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #0A0A0A' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = input.trim() && !loading ? '3px 3px 0px #0A0A0A' : 'none' }}>
            {loading ? <Loader2 size={16} color="#0A0A0A" className="animate-spin" /> : <Send size={16} color="#0A0A0A" />}
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '850px', margin: '12px auto 0' }}>
          <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enter to send · Shift+Enter for new line</p>
          {messages.length > 0 && (
            <button onClick={clearHistory} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#0A0A0A', 
                background: 'transparent', border: '2px solid #0A0A0A', padding: '4px 10px', fontWeight: 800,
                cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
                boxShadow: '2px 2px 0px #0A0A0A', transition: 'all 0.1s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF5500'; e.currentTarget.style.color = '#FFFEF0' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0A0A0A' }}>
              <Trash2 size={11} /> Clear history
            </button>
          )}
        </div>
      </div>
    </div>
  )
}