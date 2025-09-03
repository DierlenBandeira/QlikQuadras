// app/quadra/[slug]/page.tsx
import CourtDetailsClient from "./CourtDetailsClient"
import { createSupabaseServer } from "@/lib/supabase/server"

type AnyRow = Record<string, any>
export const dynamic = "force-dynamic"

type Endereco =
  | { uf?: string; cep?: string; rua?: string; bairro?: string; cidade?: string; numero?: string | number; complemento?: string }
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
  const location = [e.cidade, e.uf].filter(Boolean).join(" - ")
  const address = [ruaNum, e.bairro, e.cidade, e.uf].filter(Boolean).join(", ")
  return { location, address }
}

// chave AAAA-MM-DD fixando em UTC-3 para bater com horário local (Brasil)
function isoDateKeySaoPaulo(d: Date) {
  const sp = new Date(d.getTime() - 3 * 60 * 60 * 1000)
  const y = sp.getUTCFullYear()
  const m = String(sp.getUTCMonth() + 1).padStart(2, "0")
  const day = String(sp.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

// Resolve nome/telefone/email do owner sem depender do nome exato das colunas
async function resolveOwner(
  supabase: ReturnType<typeof createSupabaseServer>,
  ownerId?: string
) {
  if (!ownerId) return { name: "Anfitrião", phone: "", email: "" }

  const { data: op } = await supabase
    .from("owner_profiles")
    .select("*")
    .eq("player_id", ownerId)
    .maybeSingle()

  const { data: p } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", ownerId)
    .maybeSingle()

  const pickKey = (obj: any, candidates: string[]) =>
    candidates.find((k) => obj && obj[k] != null && String(obj[k]).trim() !== "")

  const nameKeyOwner = pickKey(op, ["display_name", "Display_name", "name", "nome", "username"])
  const nameKeyProfile = pickKey(p, ["display_name", "Display_name", "name", "nome", "username"])
  const phoneKeyProfile = pickKey(p, ["phone", "telefone", "celular", "mobile"])
  const emailKeyProfile = pickKey(p, ["email", "mail", "e_mail"])

  return {
    name:
      (nameKeyOwner && (op as any)[nameKeyOwner]) ||
      (nameKeyProfile && (p as any)[nameKeyProfile]) ||
      "Anfitrião",
    phone: (phoneKeyProfile && (p as any)[phoneKeyProfile]) || "",
    email: (emailKeyProfile && (p as any)[emailKeyProfile]) || "",
  }
}

// 👉 AQUI muda a assinatura para async params
export default async function QuadraPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params // ✅ aguarda params

  const supabase = createSupabaseServer()

  // carregar a quadra
  const { data: quadra, error: loadErr } = await supabase
    .from("quadras")
    .select("*")
    .eq("slug", slug) // ✅ usa a variável slug
    .maybeSingle()

  if (loadErr) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Erro ao carregar quadra</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(loadErr, null, 2)}</pre>
        <p>slug: <b>{slug}</b></p>
      </div>
    )
  }
  if (!quadra) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Quadra não encontrada</h1>
        <p>slug solicitado: <b>{slug}</b></p>
      </div>
    )
  }

  // preço
  const raw =
    quadra.price_cents ?? quadra.price ?? quadra.preco ?? quadra.preco_hora ?? quadra.valor_hora ?? 0
  const priceReais =
    typeof raw === "number" ? (raw >= 1000 ? Math.round(raw / 100) : Math.round(raw)) : 100

  // endereço
  const { location, address } = formatFromEndereco(quadra.endereco)
  const descPadrao = location ? `Quadra em ${location}.` : "Quadra disponível para locação."

  // horários disponíveis desta quadra
  const availableHoursList: string[] =
    Array.isArray(quadra.horas_disponiveis) && quadra.horas_disponiveis.length
      ? quadra.horas_disponiveis
      : ["07:00","08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"]

  // reservas (próximos 30 dias) — considera pending + confirmed como ocupados
  const now = new Date()
  const in30d = new Date(Date.now() + 30 * 86400000)
  const { data: reservas } = await supabase
    .from("reservas")
    .select("start_at, status")
    .eq("quadra_id", quadra.id)
    .in("status", ["pending", "confirmed"])
    .gte("start_at", now.toISOString())
    .lte("start_at", in30d.toISOString())

  // mapa de horários ocupados por dia
  const occupiedSlots: Record<string, string[]> = {}
  for (const r of reservas || []) {
    const d = new Date((r as any).start_at)
    const key = isoDateKeySaoPaulo(d)
    const hh = String(d.getHours()).padStart(2, "0")
    const mm = String(d.getMinutes()).padStart(2, "0")
    const t = `${hh}:${mm}`
    if (!occupiedSlots[key]) occupiedSlots[key] = []
    if (!occupiedSlots[key].includes(t)) occupiedSlots[key].push(t)
  }

  // dias lotados (todos os horários ocupados)
  const fullyBookedDates: string[] = []
  for (const [day, times] of Object.entries(occupiedSlots)) {
    const allTaken = availableHoursList.every((h) => times.includes(h))
    if (allTaken) fullyBookedDates.push(day)
  }

  // Owner (nome + telefone)
  const owner = await resolveOwner(supabase, quadra.owner_id)

  return (
    <CourtDetailsClient
      court={{
        id: String(quadra.id),
        name: quadra.nome ?? quadra.name ?? "Quadra",
        price: priceReais,
        rating: quadra.rating ?? 4.8,
        reviewCount: quadra.review_count ?? 0,
        images:
          Array.isArray(quadra.imagens) && quadra.imagens.length
            ? quadra.imagens
            : Array.isArray(quadra.images) && quadra.images.length
            ? quadra.images
            : ["/placeholder.svg"],
        amenities:
          Array.isArray(quadra.comodidades)
            ? quadra.comodidades
            : Array.isArray(quadra.amenities)
            ? quadra.amenities
            : [],
        description: quadra.descricao ?? descPadrao,
        location,               // "Cidade - UF"
        address,                // "Rua, nº, bairro, cidade, UF"
        owner,                  // { name, phone, email }
        availableHours: availableHoursList,
      }}
      occupiedSlots={occupiedSlots}
      unavailableDates={fullyBookedDates}
      slug={slug} // ✅ passa o slug já resolvido
    />
  )
}
