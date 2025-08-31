'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

export default function UserGreeting() {
  const supa = createSupabaseBrowser()
  const [firstName, setFirstName] = useState<string | null>(null)

  async function compute() {
    const { data: { session } } = await supa.auth.getSession()
    if (!session) { setFirstName(null); return }
    const user = session.user
    const full = (user.user_metadata?.full_name as string | undefined)
      ?? user.email?.split('@')[0]
    const first = (full ?? '').trim().split(/\s+/)[0] || null
    setFirstName(first)
  }

  useEffect(() => {
    compute()
    const { data: sub } = supa.auth.onAuthStateChange((_e) => compute())
    return () => sub.subscription?.unsubscribe?.()
  }, [])

  if (!firstName) return null
  return <span className="font-semibold">Olá, {firstName}!</span>
}
