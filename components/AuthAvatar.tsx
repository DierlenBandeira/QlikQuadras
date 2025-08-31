'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/browser'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar as CalendarIcon, Settings, Building2 } from 'lucide-react'
import Link from 'next/link'
import LogoutMenuItem from '@/components/LogoutMenuItem'

export default function AuthAvatar({ showOwnerLink = true }: { showOwnerLink?: boolean }) {
  const supa = createSupabaseBrowser()
  const [ready, setReady] = useState(false)
  const [logged, setLogged] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    supa.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setLogged(!!data.session)
      setUserEmail(data.session?.user?.email ?? null)
      setReady(true)
    })
    const { data: sub } = supa.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return
      setLogged(!!session)
      setUserEmail(session?.user?.email ?? null)
      setReady(true)
    })
    return () => { mounted = false; sub.subscription?.unsubscribe?.() }
  }, [])

  if (!ready || !logged) return null

  const initial = userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-9 w-9 rounded-full" aria-label="Conta">
          <Avatar className="h-9 w-9 ring-2 ring-primary-200 hover:ring-primary-300">
            {/* garanta que esse arquivo exista; senão, remova o AvatarImage */}
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
            <Link href="/proprietario"><Building2 className="mr-2 h-4 w-4" />Proprietário</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/reservas"><CalendarIcon className="mr-2 h-4 w-4" />Minhas Reservas</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracoes"><Settings className="mr-2 h-4 w-4" />Configurações</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogoutMenuItem />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
