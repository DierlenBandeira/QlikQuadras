'use client'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

export default function LogoutMenuItem() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.refresh() // força re-render dos server components e estado atualizado
    } catch (err) {
      console.error('Erro ao sair:', err)
    }
  }

  return (
    <button onClick={logout} className="w-full text-left">
      Sair
    </button>
  )
}
