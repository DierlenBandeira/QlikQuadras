'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'

function storagePathFromPublicUrl(url: string) {
  try {
    const u = new URL(url)
    const needle = '/object/public/quadras/'
    const i = u.pathname.indexOf(needle)
    if (i === -1) return null
    return decodeURIComponent(u.pathname.slice(i + needle.length))
  } catch {
    return null
  }
}

/** Exclui a quadra do dono + remove fotos do bucket */
export async function deleteQuadra(slug: string): Promise<void> {
  const supabase = createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/proprietario/acesso')

  // Busca a quadra garantindo que é do dono
  const { data: quadra, error } = await supabase
    .from('quadras')
    .select('id, owner_id, imagens')
    .eq('slug', slug)
    .single()

  if (error || !quadra) throw new Error('Quadra não encontrada')
  if (quadra.owner_id !== user.id) throw new Error('Sem permissão')

  // Remove fotos do Storage
  const imagens: string[] = Array.isArray(quadra.imagens) ? quadra.imagens : []
  const paths = imagens.map(storagePathFromPublicUrl).filter((p): p is string => Boolean(p))
  if (paths.length) {
    const { error: delFilesErr } = await supabase.storage.from('quadras').remove(paths)
    if (delFilesErr) throw new Error(`Erro ao remover fotos: ${delFilesErr.message}`)
  }

  // Remove registro
  const { error: delRowErr } = await supabase.from('quadras').delete().eq('id', quadra.id)
  if (delRowErr) throw new Error(delRowErr.message)

  redirect('/proprietario/quadras')
}

/** Aprova a quadra (apenas admins) */
export async function approveQuadra(slug: string): Promise<void> {
  const supabase = createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/proprietario/acesso')

  // Verifica se é admin (as policies já protegem no DB, mas checamos no app tb)
  const { data: isAdmin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!isAdmin) throw new Error('Acesso negado')

  const { error } = await supabase
    .from('quadras')
    .update({ aprovado: true, updated_at: new Date().toISOString() })
    .eq('slug', slug)

  if (error) throw new Error(error.message)

  redirect(`/proprietario/quadras/${slug}`)
}
