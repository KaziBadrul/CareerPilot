'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { JobSearchPage } from './JobSearchPage'

export default function JobsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])
  if (!userId) return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading…</div>
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <JobSearchPage userId={userId} hasCV={true} />
    </div>
  )
}
