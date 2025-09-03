// app/api/payments/route.ts
export const runtime = "nodejs"
import { NextResponse } from "next/server"
import mercadopago from "mercadopago"

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!, // TEST-... em sandbox, APP_USR-... em prod
})

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      amount: number | string
      method: "pix" | "credit_card" | "debit_card" | string
      installments?: number
      email: string
      name: string
      cpf: string
      token?: string           // obrigatório p/ cartão, não usar no PIX
      description?: string
      reserva_id?: string      // <- passe do frontend para ligar pagamento ↔ reserva
    }

    // normaliza valor (2 casas)
    const amount = Math.round(Number(body.amount) * 100) / 100
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "amount inválido" }, { status: 400 })
    }
    if (!body.method) {
      return NextResponse.json({ error: "method é obrigatório" }, { status: 400 })
    }

    const isCard = body.method === "credit_card" || body.method === "debit_card"
    if (isCard && !body.token) {
      return NextResponse.json({ error: "token do cartão é obrigatório" }, { status: 400 })
    }

    // (opcional) usa cabeçalho Idempotency-Key se vier do frontend
    const idemKey = (req.headers.get("Idempotency-Key") || undefined) as string | undefined

    const payment = await mercadopago.payment.create(
      {
        transaction_amount: amount,
        description: body.description || "Reserva de quadra",
        payment_method_id: body.method,          // "pix" ou "credit_card"
        installments: body.installments || 1,    // ignora para PIX
        token: isCard ? body.token : undefined,  // NÃO envie token no PIX
        payer: {
          email: body.email,
          first_name: body.name,
          identification: {
            type: "CPF",
            number: body.cpf.replace(/\D/g, ""),
          },
        },
        external_reference: body.reserva_id || undefined, // <- liga com sua reserva
        metadata: {
          reserva_id: body.reserva_id || null,
        },
        // Se quiser forçar o webhook por pagamento (além do painel):
        notification_url: process.env.MP_WEBHOOK_URL || undefined,
        // binary_mode: true, // opcional p/ cartão: rejeita imediatamente em caso de risco
        // statement_descriptor: "CLIKQUADRAS", // opcional (texto extrato)
      },
      idemKey ? { idempotencyKey: idemKey } : undefined
    )

    // Resposta amigável pro frontend
    const poi = payment.body.point_of_interaction
    const tx = poi?.transaction_data

    return NextResponse.json({
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      qr_code_base64: tx?.qr_code_base64 || null, // PIX
      qr_code: tx?.qr_code || null,               // PIX (string copia/cola)
      // devolve tudo se precisar depurar:
      // raw: payment.body,
    })
  } catch (err: any) {
    // Mercado Pago costuma retornar detalhes em err.cause
    const message =
      err?.message ||
      err?.cause?.[0]?.description ||
      "Falha ao criar pagamento"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
