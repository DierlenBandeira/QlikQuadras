// app/quadra/[slug]/components/types.ts
export type Court = {
  id: string
  name: string
  location: string        // "Cidade - UF"
  address: string         // "Rua, nº, bairro, cidade, UF"
  price: number
  rating: number
  reviewCount: number
  images: string[]
  amenities: string[]
  description: string
  owner: { name: string; phone: string; email?: string }
  availableHours: string[]
}

export type OccupiedSlots = Record<string, string[]> // { "YYYY-MM-DD": ["09:00", "10:00"] }
