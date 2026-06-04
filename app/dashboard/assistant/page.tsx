'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatWindow } from './ChatWindow'

export default function AssistantPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])
  if (!userId) return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading…</div>
  return (
    <div style={{ height: '100vh', background: '#0d1424' }}>
      <ChatWindow userId={userId} />
    </div>
  )
}