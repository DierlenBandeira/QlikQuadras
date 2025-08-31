import type { Reservation, PendingApproval, ReservationStatus, PaymentMethod } from "@/types/owner"
import type { ReservaRow } from "@/app/_data/reservas"

// util: normaliza (lowercase + remove acentos) p/ casar aliases
function norm(s?: string | null) {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

// DB: confirmed|pending|canceled  ->  UI: confirmada|pendente|cancelada
export function mapStatusToPT(status: string): ReservationStatus {
  switch (norm(status)) {
    case "confirmed": return "confirmada"
    case "pending":   return "pendente"
    case "canceled":  return "cancelada"
    // tolerar PT vindo do DB:
    case "confirmada": return "confirmada"
    case "pendente":   return "pendente"
    case "cancelada":  return "cancelada"
    default:           return "pendente"
  }
}

// DB: payment_method (livre)  ->  UI PaymentMethod
export function mapPaymentToPT(pm?: string | null): PaymentMethod {
  const v = norm(pm)
  if (["pix"].includes(v)) return "PIX"
  if (["cartao","cartao de credito","credito","debito","card"].includes(v)) return "Cartão"
  if (["dinheiro","cash"].includes(v)) return "Dinheiro"
  if (["pagar na quadra","pay at court","pay_at_court","na quadra"].includes(v)) return "Pagar na Quadra"
  // default amigável
  return "PIX"
}

// formata dinheiro a partir de cents
function brMoneyNumber(cents?: number | null) {
  return Math.max(0, Number(cents ?? 0)) / 100
}

function timeBR(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export function toReservation(r: ReservaRow): Reservation {
  const start = new Date(r.start_at)
  const end = new Date(r.end_at)
  return {
    id: r.id,
    quadra: r.quadra ?? "Quadra",
    cliente: r.cliente ?? "Cliente",
    email: r.email ?? "",
    telefone: r.telefone ?? "",
    data: start.toLocaleDateString("pt-BR"),
    horario: `${timeBR(start)} - ${timeBR(end)}`,
    valor: brMoneyNumber(r.price_cents),
    status: mapStatusToPT(r.status),
    metodoPagamento: mapPaymentToPT(r.metodo_pagamento),
    comprovantePagamento: r.comprovante_pagamento ?? undefined,
  }
}

export function toPendingApproval(r: ReservaRow): PendingApproval {
  const start = new Date(r.start_at)
  const end = new Date(r.end_at)
  return {
    id: r.id,
    quadra: r.quadra ?? "Quadra",
    cliente: r.cliente ?? "Cliente",
    email: r.email ?? "",
    telefone: r.telefone ?? "",
    cpf: r.cpf ?? "",
    data: start.toLocaleDateString("pt-BR"),
    horario: `${timeBR(start)} - ${timeBR(end)}`,
    valor: brMoneyNumber(r.price_cents),
    metodoPagamento: mapPaymentToPT(r.metodo_pagamento),
    dataSolicitacao: (r.data_solicitacao ? new Date(r.data_solicitacao) : start).toISOString(),
  }
}
