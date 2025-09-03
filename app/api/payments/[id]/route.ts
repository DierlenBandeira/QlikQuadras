// app/api/payments/[id]/route.ts
export const runtime = "nodejs"
import { NextResponse } from "next/server"
import mercadopago from "mercadopago"

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! })

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const p = await mercadopago.payment.findById(params.id)
    const pay = p.body
    return NextResponse.json({
      id: pay.id,
      status: pay.status,              // "approved" | "pending" | "rejected" ...
      status_detail: pay.status_detail,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Falha ao consultar" }, { status: 500 })
  }
}
