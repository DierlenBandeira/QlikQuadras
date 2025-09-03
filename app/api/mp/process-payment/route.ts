// app/api/mp/process-payment/route.ts
import { NextResponse } from "next/server"
import crypto from "node:crypto"

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN_TEST || process.env.MP_ACCESS_TOKEN

export async function POST(req: Request) {
  if (!ACCESS_TOKEN) {
    console.error("MP access token ausente.")
    return NextResponse.json({ status: "error", message: "Credenciais ausentes" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const isPix = (body.payment_method_id || "").toLowerCase() === "pix"

    // monta payload respeitando método
    const payload: any = {
      transaction_amount: Number(body.transaction_amount || 0),
      description: body.description || "Reserva de Quadra",
      payment_method_id: body.payment_method_id, // "pix" | "visa" | "master" etc.
      payer: {
        email: body?.payer?.email,
        first_name: body?.payer?.first_name,
        last_name: body?.payer?.last_name,
        identification: body?.payer?.identification, // { type: "CPF", number: "..." }
      },
      metadata: body?.metadata || {},
      notification_url: process.env.MP_WEBHOOK_URL || undefined,
    }

    if (!isPix) {
      // cartão
      payload.token = body.token
      payload.installments = body.installments || 1
    }
    // PIX não usa token/parcelas

    const idempotencyKey = crypto.randomUUID()

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    })

    const data = await mpRes.json()

    if (!mpRes.ok) {
      console.error("MP payment error:", data)
      return NextResponse.json(
        { status: "error", message: data?.message || "Falha no pagamento", details: data },
        { status: 400 }
      )
    }

    // devolve TUDO (inclui QR code do PIX em data.point_of_interaction.transaction_data)
    return NextResponse.json(data)
  } catch (e) {
    console.error("process-payment internal error:", e)
    return NextResponse.json({ status: "error", message: "Erro interno" }, { status: 500 })
  }
}
