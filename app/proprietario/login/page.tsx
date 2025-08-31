'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const supa = createSupabaseBrowser()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data: sub } = supa.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/proprietario/quadras')
        router.refresh()
      }
    })
    return () => sub.subscription?.unsubscribe?.()
  }, [supa, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supa.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    // Em geral já navega aqui, mas o listener acima cobre qualquer atraso:
    router.replace('/proprietario/quadras')
    router.refresh()
  }

  async function loginGoogle() {
    setLoading(true)
    try {
      await supa.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/proprietario/quadras` }
      })
    } finally {
      setLoading(false)
    }
  }

  async function signup() {
    setLoading(true); setError(null)
    const { error } = await supa.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    // se exigir confirmação por email, a sessão só aparece depois do confirm
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Não tem conta? <button onClick={signup} className="underline">Criar conta</button>
      </div>
    </div>
  )
}
