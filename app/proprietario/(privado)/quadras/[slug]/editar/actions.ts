'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'

const schema = z.object({
  nome: z.string().min(3),
  esporte: z.enum(['futebol7','salao','volei','basquete','tenis','beach_tenis']),
  preco_hora: z.coerce.number().min(0),
  descricao: z.string().min(1),
  cep: z.string().min(8),
  rua: z.string().min(1),
  numero: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  uf: z.string().length(2),
  comodidades: z.array(z.string()).optional(),
})

export async function updateQuadra(slug: string, formData: FormData): Promise<void> {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/proprietario/acesso')

  const raw = {
    nome: String(formData.get('nome') ?? ''),
    esporte: String(formData.get('esporte') ?? 'futebol7'),
    preco_hora: formData.get('preco_hora'),
    descricao: String(formData.get('descricao') ?? ''),
    cep: String(formData.get('cep') ?? ''),
    rua: String(formData.get('rua') ?? ''),
    numero: String(formData.get('numero') ?? ''),
    bairro: String(formData.get('bairro') ?? ''),
    cidade: String(formData.get('cidade') ?? ''),
    uf: String(formData.get('uf') ?? ''),
    comodidades: (formData.getAll('comodidades') as string[]) ?? [],
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map(i => i.message).join('; '))
  }

  // mapeia só os que diferem de nome no banco
  const esporteMap: Record<string, 'futebol'|'salao'|'volei'|'basquete'|'tenis'|'beach_tennis'|'outro'> = {
    futebol7: 'futebol',
    beach_tenis: 'beach_tennis',
    salao: 'salao',
    volei: 'volei',
    basquete: 'basquete',
    tenis: 'tenis',
  }
  const esporteDB = esporteMap[parsed.data.esporte] ?? 'outro'

  const endereco = {
    cep: parsed.data.cep,
    rua: parsed.data.rua,
    numero: parsed.data.numero,
    bairro: parsed.data.bairro,
    cidade: parsed.data.cidade,
    uf: parsed.data.uf,
  }

  // Atualiza somente campos de texto/número/endereço/comodidades (imagens ficam para o próximo passo)
  const { error } = await supabase
    .from('quadras')
    .update({
      nome: parsed.data.nome,
      esporte: esporteDB,
      preco_hora: parsed.data.preco_hora,
      descricao: parsed.data.descricao,
      endereco,
      comodidades: parsed.data.comodidades ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)

  redirect(`/proprietario/quadras/${slug}`)
}
