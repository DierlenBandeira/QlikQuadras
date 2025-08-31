'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar as CalendarIcon, Settings, Building2 } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/browser'
import LogoutMenuItem from '@/components/LogoutMenuItem'

type GreetingsProps = { showOwnerLink?: boolean }

export default function Greetings({ showOwnerLink = true }: GreetingsProps) {
  const supa = createSupabaseBrowser()
  const [ready, setReady] = useState(false)
  const [logged, setLogged] = useState(false)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const mountedRef = useRef(true)

  function applySession(session: any | null) {
    const user = session?.user ?? null
    setLogged(!!user)
    const email = user?.email ?? null
    setUserEmail(email)
    const fullMeta =
      typeof user?.user_metadata?.full_name === 'string'
        ? (user!.user_metadata!.full_name as string)
        : (email ? email.split('@')[0] : '')
    const name = fullMeta?.trim().split(/\s+/)[0] || null
    setFirstName(name)
  }

  useEffect(() => {
    mountedRef.current = true

    // 1) Estado inicial
    supa.auth.getSession()
      .then(({ data }) => {
        if (!mountedRef.current) return
        applySession(data?.session ?? null)
        setReady(true)
      })
      .catch(() => {
        if (!mountedRef.current) return
        applySession(null)
        setReady(true)
      })

    // 2) Reagir a login/logout IMEDIATAMENTE usando a session do evento
    const { data: sub } = supa.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return
      applySession(session ?? null)
      setReady(true)
    })

    // 3) Revalidar quando a aba volta (cobre redirecionamentos OAuth)
    const onFocus = async () => {
      try {
        const { data } = await supa.auth.getSession()
        if (!mountedRef.current) return
        applySession(data?.session ?? null)
        setReady(true)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus()
    })
    window.addEventListener('focus', onFocus)

    // 4) Fallback curto (850ms) contra race conditions
    const t = setTimeout(onFocus, 850)

    return () => {
      mountedRef.current = false
      sub.subscription?.unsubscribe?.()
      window.removeEventListener('focus', onFocus)
      clearTimeout(t)
    }
  }, [supa])

  // ---------- UI ----------
  if (!ready) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-5 w-44 rounded bg-gray-100 animate-pulse" />
        <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (!logged) {
    return (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-secondary-700 whitespace-nowrap">
          Bem-vindo ao QlikQuadras
        </span>
        <Link href="/proprietario/login">
          <Button className="rounded-full">Entrar</Button>
        </Link>
      </div>
    )
  }

  const initial = userEmail?.[0]?.toUpperCase() ?? '?'
  const displayName = firstName ?? 'bem-vindo(a)'

  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold text-secondary-700 whitespace-nowrap">
        Olá, {displayName}!
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-9 w-9 rounded-full" aria-label="Conta">
            <Avatar className="h-9 w-9 ring-2 ring-primary-200 hover:ring-primary-300">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback className="bg-primary-500 text-white font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 z-[60]">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {showOwnerLink && (
            <DropdownMenuItem asChild>
              <Link href="/proprietario"><Building2 className="mr-2 h-4 w-4" /> Proprietário</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/reservas"><CalendarIcon className="mr-2 h-4 w-4" /> Minhas Reservas</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes"><Settings className="mr-2 h-4 w-4" /> Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogoutMenuItem />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
