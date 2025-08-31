'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const schema = z.object({
  nome: z.string().min(3, 'Nome da quadra é obrigatório'),
  esporte: z.enum(['futebol7','salao','volei','basquete','tenis','beach_tenis']),
  preco_hora: z.coerce.number().min(0, 'Preço inválido'),
  descricao: z.string().min(1, 'Descreva a quadra'),
  cep: z.string().min(8),
  rua: z.string().min(2),
  numero: z.string().min(1),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  uf: z.string().length(2),
  comodidades: z.array(z.string()).optional(),
})

function slugify(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createQuadra(formData: FormData): Promise<void> {
  const supabase = createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/proprietario/acesso')

  const raw = {
    nome: String(formData.get('nome') || ''),
    esporte: String(formData.get('esporte') || 'salao'),
    preco_hora: formData.get('preco_hora'),
    descricao: String(formData.get('descricao') || ''),
    cep: String(formData.get('cep') || ''),
    rua: String(formData.get('rua') || ''),
    numero: String(formData.get('numero') || ''),
    bairro: String(formData.get('bairro') || ''),
    cidade: String(formData.get('cidade') || ''),
    uf: String(formData.get('uf') || ''),
    comodidades: (formData.getAll('comodidades') as string[]) ?? [],
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map(i => i.message).join('; '))
  }

  const endereco = {
    cep: parsed.data.cep, rua: parsed.data.rua, numero: parsed.data.numero,
    bairro: parsed.data.bairro, cidade: parsed.data.cidade, uf: parsed.data.uf
  }

    const esporteMap: Record<string, 'futebol'|'salao'|'volei'|'basquete'|'tenis'|'beach_tennis'|'outro'> = {
    futebol7: 'futebol',
    beach_tenis: 'beach_tennis',
    salao: 'salao',
    volei: 'volei',
    basquete: 'basquete',
    tenis: 'tenis',
    }

    const esporteDB = esporteMap[parsed.data.esporte] ?? 'outro'

  const slug = `${slugify(parsed.data.nome)}-${Math.random().toString(36).slice(2,6)}`

  // ===== Upload das imagens =====
  // espere um input com name="imagens" (multiple). Limite: 10 arquivos, até 10MB, png/jpg/jpeg.
  const arquivos = (formData.getAll('imagens') as File[]) || []
  const imagens: string[] = []

  if (arquivos.length > 10) {
    throw new Error('Máximo de 10 fotos por quadra.')
  }

  for (const file of arquivos) {
    if (!file || file.size === 0) continue
    if (file.size > 100 * 1024 * 1024) throw new Error('Cada foto deve ter até 10MB.')
    const typeOk = ['image/png','image/jpg','image/jpeg','image/webp'].includes(file.type)
    if (!typeOk) throw new Error('Formato de imagem inválido (use PNG/JPG/JPEG/WEBP).')

    const filePath = `${user.id}/${slug}/${Date.now()}-${file.name}`
    const { data: up, error: upErr } = await supabase
      .storage
      .from('quadras')
      .upload(filePath, file, { upsert: false })

    if (upErr) throw new Error(upErr.message)

    const { data: pub } = supabase.storage.from('quadras').getPublicUrl(up!.path)
    imagens.push(pub.publicUrl)
  }
  // ===== fim upload =====

  const { error: insErr } = await supabase.from('quadras').insert({
    owner_id: user.id,
    nome: parsed.data.nome,
    slug,
    descricao: parsed.data.descricao,
    esporte: esporteDB,
    preco_hora: parsed.data.preco_hora,
    endereco,
    comodidades: parsed.data.comodidades ?? [],
    imagens,              // salva as URLs públicas
    aprovado: false,
  })

  if (insErr) throw new Error(insErr.message)

  redirect('/proprietario/quadras')
}
