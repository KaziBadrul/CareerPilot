'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { JobSearchPage } from './JobSearchPage'

export default function JobsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [supabase])

  if (!userId) {
    return <div style={{ padding: 40, color: 'var(--muted)' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <JobSearchPage userId={userId} hasCV={true} initialQuery={initialQuery} />
    </div>
  )
}
