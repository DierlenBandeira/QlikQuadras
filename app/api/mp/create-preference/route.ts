// app/api/mp/create-preference/route.ts
import { NextResponse } from "next/server"

function getOrigin(req: Request) {
  // Reconstrói a origem correta (funciona com proxies/túnel)
  const h = new Headers(req.headers)
  const proto = h.get("x-forwarded-proto") || "http"
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  return `${proto}://${host}`
}

const ACCESS_TOKEN =
  process.env.MP_ACCESS_TOKEN_TEST ?? process.env.MP_ACCESS_TOKEN ?? ""

export async function POST(req: Request) {
  if (!ACCESS_TOKEN) {
    console.error("MP access token ausente. Defina MP_ACCESS_TOKEN_TEST no .env.local")
    return NextResponse.json({ error: "Credenciais ausentes" }, { status: 500 })
  }

  try {
    const { title, price, metadata } = await req.json()
    const origin = getOrigin(req)

    // defina paths que existam na sua app (ou crie páginas simples)
    const successUrl = process.env.NEXT_PUBLIC_MP_SUCCESS_URL || `${origin}/sucesso`
    const failureUrl = process.env.NEXT_PUBLIC_MP_FAILURE_URL || `${origin}/falha`
    const pendingUrl = process.env.NEXT_PUBLIC_MP_PENDING_URL || `${origin}/pendente`

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: title ?? "Reserva de Quadra",
            quantity: 1,
            unit_price: Number(price ?? 0),
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: successUrl,   // ✅ obrigatório para usar auto_return
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: "approved", // ✅ agora é válido
        notification_url:
          process.env.MP_WEBHOOK_URL || `${origin}/api/mp/webhook`,
        metadata: metadata ?? {},
      }),
    })

    if (!mpRes.ok) {
      const txt = await mpRes.text()
      console.error("Mercado Pago error:", mpRes.status, txt)
      return NextResponse.json({ error: "Falha ao criar preferência" }, { status: 500 })
    }

    const data = await mpRes.json()
    return NextResponse.json({ id: data.id })
  } catch (e) {
    console.error("create-preference internal error:", e)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// (Opcional) GET pra teste rápido no navegador
export async function GET(req: Request) {
  return NextResponse.json({ ok: true, origin: getOrigin(req) })
}
