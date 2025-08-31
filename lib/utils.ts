// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------- helpers de segurança ----------
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Valida se string é UUID válido; caso contrário, retorna null
export function asUuidOrNull(v?: string | null) {
  return v && UUID_RE.test(v) ? v : null
}

// Converte para ISO (timestamp) se for válido; caso contrário, null
export function toISOorNull(v?: string | null) {
  if (!v) return null
  const t = Date.parse(v)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}

// Açúcares p/ montar query sem mandar vazio/“all”
export const eqIf = <T>(q: any, col: string, v: T | null | undefined) =>
  (v === null || v === undefined || v === "" ? q : q.eq(col, v))

export const gteIf = (q: any, col: string, v?: string | null) =>
  v ? q.gte(col, v) : q

export const lteIf = (q: any, col: string, v?: string | null) =>
  v ? q.lte(col, v) : q
