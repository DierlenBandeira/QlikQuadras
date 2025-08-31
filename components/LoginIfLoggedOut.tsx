'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

export default function LoginIfLoggedOut() {
  const [ready, setReady] = useState(false)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    const supa = createSupabaseBrowser()
    supa.auth.getSession().then(({ data }) => { setLogged(!!data.session); setReady(true) })
    const { data: sub } = supa.auth.onAuthStateChange((_e, session) => setLogged(!!session))
    return () => sub.subscription?.unsubscribe?.()
  }, [])

  if (!ready || logged) return null
  return (
    <Link href="/proprietario/login">
      <Button className="rounded-full">Entrar</Button>
    </Link>
  )
}
