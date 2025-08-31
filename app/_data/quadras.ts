// app/_data/quadras.ts
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"

export async function countQuadrasAtivasDoOwner() {
  const supa = createSupabaseServer()

  // Auth do usuário logado
  const { data: userRes, error: authErr } = await supa.auth.getUser()
  if (authErr) throw authErr
  const user = userRes?.user
  if (!user) return 0

  // Conta apenas as quadras do proprietário aprovadas (ativas)
  const { count, error } = await supa
    .from("quadras")
    .select("id", { count: "exact", head: true }) // só conta, não traz linhas
    .eq("owner_id", user.id)
    .eq("aprovado", true)

  if (error) throw error
  return count ?? 0
}
