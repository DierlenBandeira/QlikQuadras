// app/api/reservas/[id]/status/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServer } from "@/lib/supabase/server"

const Body = z.object({
  status: z.enum(["confirmed", "canceled"]),
})

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params || {}
  if (!id) return NextResponse.json({ error: "ID ausente." }, { status: 400 })

  // valida payload
  let parsed: z.infer<typeof Body>
  try {
    parsed = Body.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const supabase = createSupabaseServer()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  }

  // 1) tentativa com valores EN-US
  const patchEN: Record<string, any> = { status: parsed.status }
  let resp = await supabase
    .from("reservas")
    .update(patchEN)
    .eq("id", id)
    // se você usa RLS por dono, ative tb:
    // .eq("owner_id", user.id)
    .select("id,status")

  // Se erro de ENUM (22P02), tenta PT-BR automaticamente
  const isEnumErr = resp.error?.code === "22P02" || /invalid input value for enum/i.test(resp.error?.message || "")
  if (isEnumErr) {
    const pt = parsed.status === "confirmed" ? "confirmada" : "cancelada"
    const patchPT = { status: pt }
    resp = await supabase
      .from("reservas")
      .update(patchPT)
      .eq("id", id)
      // .eq("owner_id", user.id) // se aplicável
      .select("id,status")
  }

  // 2) erros reais do banco
  if (resp.error) {
    console.error("[PUT /reservas/:id/status]", resp.error)
    return NextResponse.json(
      {
        error: "Falha no banco ao atualizar o status.",
        code: resp.error.code,
        message: resp.error.message,
        details: resp.error.details,
        hint: resp.error.hint,
      },
      { status: 500 }
    )
  }

  // 3) nenhuma linha atualizada => ou não existe, ou RLS bloqueou
  if (!resp.data || resp.data.length === 0) {
    return NextResponse.json(
      { error: "Reserva não encontrada ou sem permissão (RLS)." },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
