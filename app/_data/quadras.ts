// app/_data/quadras.ts
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"

/** Conta apenas as quadras ativas (aprovadas) do proprietário logado */
export async function countQuadrasAtivasDoOwner() {
  const supa = createSupabaseServer()

  const { data: userRes, error: authErr } = await supa.auth.getUser()
  if (authErr) throw authErr
  const user = userRes?.user
  if (!user) return 0

  const { count, error } = await supa
    .from("quadras")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("aprovado", true)

  if (error) throw error
  return count ?? 0
}

/** DTO usado pelo CourtDetailsClient */
export type CourtDTO = {
  id: string
  name: string
  location: string           // "Cidade - UF"
  address: string            // "Rua, nº, bairro, cidade, UF"
  price: number              // BRL por hora
  rating: number
  reviewCount: number
  images: string[]
  amenities: string[]
  description: string
  owner: { name: string; phone: string; whatsapp: string }
  availableHours: string[]
}

// -------- helpers de endereço (JSONB -> strings) --------
type Endereco =
  | {
      uf?: string
      cep?: string
      rua?: string
      bairro?: string
      cidade?: string
      numero?: string | number
      complemento?: string
    }
  | null
  | string
  | undefined

function parseEndereco(raw: Endereco): Record<string, any> {
  if (!raw) return {}
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  if (typeof raw === "object") return raw as any
  return {}
}

function formatFromEndereco(raw: Endereco) {
  const e = parseEndereco(raw)
  const ruaNum = [e.rua, e.numero].filter(Boolean).join(", ")
  const location = [e.cidade, e.uf].filter(Boolean).join(" - ") // "Cidade - UF"
  const address = [ruaNum, e.bairro, e.cidade, e.uf].filter(Boolean).join(", ") // "Rua, nº, bairro, cidade, UF"
  return { location, address }
}

// -------- loader principal --------
export async function getCourtBySlug(slug: string): Promise<CourtDTO> {
  const supa = createSupabaseServer()

  const { data, error } = await supa
    .from("quadras")
    .select(
      `
      id,
      slug,
      nome,
      endereco,
      price_cents,
      rating,
      review_count,
      imagens,
      amenities,
      descricao,
      owner_id,
      owner:owner_profiles(name, phone, whatsapp)
    `
    )
    .eq("slug", slug)
    .single()

  if (error) throw error

  // owner via relação ou fallback por owner_id
  let owner = (data as any)?.owner as { name: string; phone: string; whatsapp: string } | null
  if (!owner && (data as any).owner_id) {
    const { data: ownerRow } = await supa
      .from("owner_profiles")
      .select("name, phone, whatsapp")
      .eq("id", (data as any).owner_id)
      .single()
    owner = ownerRow ?? { name: "", phone: "", whatsapp: "" }
  }
  if (!owner) owner = { name: "", phone: "", whatsapp: "" }

  // endereço -> strings
  const { location, address } = formatFromEndereco((data as any).endereco)

  return {
    id: String((data as any).id),
    name: (data as any).nome ?? (data as any).name ?? "Quadra",
    location,
    address,
    price: Math.round((((data as any).price_cents ?? 0) as number) / 100),
    rating: (data as any).rating ?? 0,
    reviewCount: (data as any).review_count ?? 0,
    images:
      Array.isArray((data as any).imagens) && (data as any).imagens.length
        ? (data as any).imagens
        : Array.isArray((data as any).images) && (data as any).images.length
        ? (data as any).images
        : [],
    amenities:
      Array.isArray((data as any).amenities)
        ? (data as any).amenities
        : Array.isArray((data as any).comodidades)
        ? (data as any).comodidades
        : [],
    description: (data as any).descricao ?? "",
    owner,
    // ajuste depois se vier de outra tabela
    availableHours: [],
  }
}
