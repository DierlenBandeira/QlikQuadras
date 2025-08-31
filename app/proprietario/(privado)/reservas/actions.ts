"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServer } from "@/lib/supabase/server"
import { asUuidOrNull } from "@/lib/utils"

export async function cancelReservationAction(formData: FormData) {
  const id = asUuidOrNull(String(formData.get("id") ?? null))
  if (!id) throw new Error("ID da reserva inválido ou ausente")

  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Não autenticado")

  // RLS já garante que só owner ou o próprio cliente pode cancelar
  const { error } = await supabase
    .from("reservas")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("id", id) // agora id é sempre UUID válido

  if (error) throw error

  // atualizar a lista
  revalidatePath("/proprietario/reservas")
  return { ok: true }
}
