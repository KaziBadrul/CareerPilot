'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatWindow } from './ChatWindow'
import { Loader2 } from 'lucide-react'

export default function AssistantPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])
  
  if (!userId) return (
    <div style={{ minHeight: '100vh', background: '#FFFEF0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="#C8FF00" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em' }}>
          AUTHENTICATING USER PROFILES...
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', background: '#FFFEF0' }}>
      <ChatWindow userId={userId} />
    </div>
  )
}