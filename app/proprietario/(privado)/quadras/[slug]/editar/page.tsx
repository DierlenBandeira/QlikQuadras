// app/proprietario/quadras/[slug]/editar/page.tsx
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import EditForm from './EditForm'

export default async function EditarQuadraPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: quadra, error } = await supabase
    .from('quadras')
    .select('slug, nome, esporte, preco_hora, descricao, endereco, comodidades')
    .eq('slug', params.slug)
    .eq('owner_id', user.id)
    .single()

  if (error || !quadra) notFound()

  return (
    <EditForm
      slug={quadra.slug}
      initial={{
        nome: quadra.nome,
        esporte: String(quadra.esporte),
        preco_hora: Number(quadra.preco_hora || 0),
        descricao: quadra.descricao || '',
        endereco: (quadra.endereco as any) || {},
        comodidades: (quadra.comodidades as string[]) || [],
      }}
    />
  )
}
