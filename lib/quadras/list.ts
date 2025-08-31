// lib/quadras/list.ts
import { createSupabaseServer } from '@/lib/supabase/server'

export type CourtCard = {
  id: string
  slug: string
  name: string
  location: string
  sport: string
  price: number
  rating: number
  reviews: number
  image: string | null
  amenities: string[]
  available: boolean
  distance?: string
  featured?: boolean
  premium?: boolean
}

function esporteLabel(db: string): string {
  const m: Record<string, string> = {
    futebol: 'Futebol',
    salao: 'Futsal/Salão',
    volei: 'Vôlei',
    basquete: 'Basquete',
    tenis: 'Tênis',
    beach_tennis: 'Beach Tênis',
    outro: 'Esporte',
  }
  return m[db] ?? db
}

function enderecoToLocation(e?: any): string {
  if (!e) return ''
  const rua = [e.rua, e.numero].filter(Boolean).join(', ')
  const cidade = [e.cidade, e.uf].filter(Boolean).join(' - ')
  const bairro = e.bairro ? `, ${e.bairro}` : ''
  return [rua, bairro].filter(Boolean).join('') + (cidade ? ` • ${cidade}` : '')
}

export async function fetchApprovedCourts(): Promise<CourtCard[]> {
  const supabase = createSupabaseServer()

  const { data, error } = await supabase
    .from('quadras')
    .select('id, slug, nome, esporte, preco_hora, imagens, comodidades, endereco, aprovado')
    .eq('aprovado', true)
    .order('created_at', { ascending: false })
    .limit(36)

  if (error || !data) return []

  return data.map((q) => {
    const imagens = (q.imagens as string[] | null) ?? []
    const endereco = q.endereco as any
    return {
      id: String(q.id),
      slug: q.slug,
      name: q.nome,
      location: enderecoToLocation(endereco),
      sport: esporteLabel(String(q.esporte)),
      price: Number(q.preco_hora || 0),
      rating: 4.7,  // placeholder
      reviews: 0,   // placeholder
      image: imagens[0] ?? null,
      amenities: ((q.comodidades as string[]) ?? []).map(a => a.replace('-', ' ')),
      available: true, // placeholder
      featured: false, // placeholder
      premium: false,  // placeholder
    }
  })
}
