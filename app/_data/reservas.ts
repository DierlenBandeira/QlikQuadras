// app/_data/reservas.ts
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { asUuidOrNull, toISOorNull, eqIf, gteIf, lteIf } from "@/lib/utils"

const TABLE = "reservas_com_detalhes" as const
const CANDIDATE_OWNER_COLUMNS = ["player_id", "owner_id", "user_id"] as const

type AppStatus = "confirmed" | "canceled" | "pending"
type Params = { status?: AppStatus | null; from?: string | null; to?: string | null }

// Status do app → candidatos no DB (ajuste aqui conforme seu enum real)
const STATUS_CANDIDATES: Record<AppStatus, string[]> = {
  confirmed: ["confirmed", "confirmado", "approved", "aprovada"],
  canceled:  ["canceled", "cancelled", "cancelado", "cancelada"],
  pending:   ["pending_payment", "pending", "awaiting", "aguardando", "pendente"],
}

export async function listReservasDoOwner(input: Params = {}) {
  const { status: rawStatus = null, from: rawFrom = null, to: rawTo = null } = input || {}

  const supa = createSupabaseServer()
  const { data: userRes, error: authErr } = await supa.auth.getUser()
  if (authErr) { console.dir({ authErr }, { depth: null }); throw authErr }
  const user = userRes?.user
  if (!user) return []

  const ownerId = asUuidOrNull(user.id) ?? user.id
  const fromISO = toISOorNull(rawFrom)
  const toISO  = toISOorNull(rawTo)

  // Base builder
  const baseQuery = (ownerColumn: (typeof CANDIDATE_OWNER_COLUMNS)[number]) => {
    let q = supa.from(TABLE).select("*").throwOnError()
    q = eqIf(q, ownerColumn, ownerId)
    q = gteIf(q, "start_at", fromISO)
    q = lteIf(q, "end_at", toISO)
    return q.order("start_at", { ascending: true })
  }

  // Tenta dono em cascata
  for (const ownerCol of CANDIDATE_OWNER_COLUMNS) {
    // Se não foi solicitado status, execute direto
    if (!rawStatus) {
      try {
        const { data } = await baseQuery(ownerCol)
        return data ?? []
      } catch (e: any) {
        const code = e?.code ?? e?.cause?.code
        if (code === "42703") continue // coluna não existe → tenta a próxima
        logAndThrow(e, { ownerId, ownerCol, table: TABLE, fromISO, toISO })
      }
    }

    // Houve status solicitado → tente candidatos até um aceitar; se todos falharem por 22P02, rode sem status
    const candidates = STATUS_CANDIDATES[rawStatus as AppStatus] ?? [rawStatus]
    let triedAny = false
    let lastErr: any = null

    for (const dbStatus of candidates) {
      triedAny = true
      try {
        let q = baseQuery(ownerCol)
        q = eqIf(q, "status", dbStatus) // pode disparar 22P02 se enum não tiver esse literal
        const { data } = await q
        return data ?? []
      } catch (e: any) {
        lastErr = e
        const code = e?.code ?? e?.cause?.code
        if (code === "42703") { // coluna status não existe? improvável, mas trate
          break // sai do loop de status e tenta próxima coluna de owner
        }
        if (code === "22P02") {
          // valor inválido para enum: tenta o próximo candidato
          continue
        }
        // outro erro → log rico e rethrow
        logAndThrow(e, { ownerId, ownerCol, table: TABLE, fromISO, toISO, triedStatus: dbStatus })
      }
    }

    // Se tentou alguns e todos deram 22P02, rode SEM status para não quebrar
    if (triedAny) {
      try {
        const { data } = await baseQuery(ownerCol)
        return data ?? []
      } catch (e: any) {
        const code = e?.code ?? e?.cause?.code
        if (code === "42703") continue
        logAndThrow(e, { ownerId, ownerCol, table: TABLE, fromISO, toISO, fallbackNoStatus: true })
      }
    }
  }

  // Nenhuma coluna candidata existe
  throw makeRichError("COLUMN_NOT_FOUND", "Nenhuma coluna de vínculo com usuário encontrada na view.", {
    ownerId, triedColumns: CANDIDATE_OWNER_COLUMNS, table: TABLE, fromISO, toISO
  })
}

// ---- wrappers de compatibilidade ----
export async function listPendentesDoOwner()   { return listReservasDoOwner({ status: "pending" }) }
export async function listConfirmadasDoOwner() { return listReservasDoOwner({ status: "confirmed" }) }
export async function listCanceladasDoOwner()  { return listReservasDoOwner({ status: "canceled" }) }

// ---------- utils de log/erro locais ----------
function logAndThrow(e: any, extra: Record<string, unknown>) {
  const payload = {
    code: e?.code,
    message: e?.message,
    details: e?.details,
    hint: e?.hint,
    ...extra,
  }
  console.error("[Server] listReservasDoOwner catch JSON", JSON.stringify(payload, null, 2))
  throw new Error(`[listReservasDoOwner] ${JSON.stringify(payload)}`)
}

function makeRichError(code: string, message: string, extra: Record<string, unknown>) {
  const payload = { code, message, details: null, hint: null, ...extra }
  console.error("[Server] listReservasDoOwner catch JSON", JSON.stringify(payload, null, 2))
  return new Error(`[listReservasDoOwner] ${JSON.stringify(payload)}`)
}
