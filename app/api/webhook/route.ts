// app/api/webhook/route.ts
import { NextResponse } from "next/server"
import mercadopago from "mercadopago"

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  const body = await req.json()

  // Exemplo de payload que chega:
  // {
  //   "action": "payment.created",
  //   "data": { "id": "131321321" },
  //   "type": "payment"
  // }

  if (body.type === "payment" && body.data?.id) {
    try {
      const payment = await mercadopago.payment.findById(body.data.id)
      const status = payment.body.status // "approved", "pending", "rejected"...

      // aqui você atualiza a reserva no seu banco
      // ex:
      // await supabase.from("reservas").update({ status }).eq("payment_id", payment.body.id)

      console.log("💰 Pagamento recebido:", payment.body.id, status)
    } catch (e) {
      console.error("Erro ao buscar pagamento:", e)
    }
  }

  return NextResponse.json({ ok: true })
}
