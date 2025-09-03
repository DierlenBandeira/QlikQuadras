// app/checkout/CheckoutClient.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Smartphone,
  Shield,
  Clock,
  MapPin,
  Calendar as IconCalendar,
  AlertCircle,
  CheckCircle,
  FileText,
  CreditCard,
  Copy as CopyIcon,
} from "lucide-react"

import { createSupabaseBrowser } from "@/lib/supabase/browser"

// Bricks (sem SSR)
const Payment = dynamic(() => import("@mercadopago/sdk-react").then(m => m.Payment), { ssr: false })

// ---- helpers ----
function humanizeSlug(slug?: string | null) {
  if (!slug) return "Quadra"
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (m) => m.toUpperCase())
}
function formatDateBR(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  try { return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) } catch { return d.toLocaleDateString("pt-BR") }
}
function onlyDigits(s: string) { return (s || "").replace(/\D+/g, "") }

export default function CheckoutClient() {
  const params = useSearchParams()
  const router = useRouter()
  const supa = createSupabaseBrowser()

  // ---- Params ----
  const courtId = String(params.get("quadra") ?? params.get("qid") ?? "")
  const slug = params.get("slug")
  const isoDate = String(params.get("date") ?? "")
  const time = String(params.get("time") ?? "")
  const price = Number(params.get("price") ?? 0)

  // ---- Estado da quadra ----
  const [courtName, setCourtName] = useState<string>(humanizeSlug(slug))
  const [courtLocation, setCourtLocation] = useState<string>("—")
  const [courtImage, setCourtImage] = useState<string>("/placeholder.svg")

  useEffect(() => {
    (async () => {
      if (!courtId) return
      try {
        // Ajuste campos/tabela conforme seu schema
        const { data, error } = await supa
          .from("quadras")
          .select("id, name, city, uf, address, location, image_url, cover_image, slug")
          .eq("id", courtId)
          .maybeSingle()
        if (error) { console.warn("Supabase (quadras):", error.message); return }
        if (!data) return
        setCourtName(data.name || humanizeSlug(data.slug) || courtName)
        const loc = [data.city, data.uf].filter(Boolean).join(" - ") || data.location || data.address || "—"
        setCourtLocation(loc)
        const img = data.cover_image || data.image_url
        if (img) setCourtImage(img)
      } catch (e) { console.warn("Falha ao carregar quadra:", e) }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courtId])

  // ---- Usuário (prefill) ----
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supa.auth.getUser()
        if (!user) return
        const { data: profile } = await supa.from("profiles").select("display_name, cpf").eq("id", user.id).maybeSingle()
        setFullName(prev => prev || profile?.display_name || user.user_metadata?.name || "")
        setEmail(prev => prev || user.email || user.user_metadata?.email || "")
        setCpf(prev => prev || profile?.cpf || "")
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- SDK MP ----
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? ""
  const [sdkReady, setSdkReady] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        if (!publicKey) throw new Error("NEXT_PUBLIC_MP_PUBLIC_KEY ausente.")
        const { initMercadoPago } = await import("@mercadopago/sdk-react")
        await initMercadoPago(publicKey, { locale: "pt-BR" })
        setSdkReady(true)
      } catch (e: any) {
        console.error("MP SDK init:", e)
        setSdkError("Falha ao carregar o SDK do Mercado Pago. Verifique a chave pública e bloqueadores.")
        setSdkReady(false)
      }
    })()
  }, [publicKey])

  const canRenderBrick = useMemo(() => sdkReady && !sdkError && price > 0, [sdkReady, sdkError, price])

  // ---- PIX modal ----
  const [pixModalOpen, setPixModalOpen] = useState(false)
  const [pixQrBase64, setPixQrBase64] = useState<string>("")
  const [pixCode, setPixCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  function copyPix() {
    if (!pixCode) return
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  // ---- Submit do BRICK ----
const onSubmitPayment = useCallback(async ({ formData }: any) => {
  // Método escolhido no Brick
  const method = String(formData.payment_method_id || "").toLowerCase()

  // e-mail: prioriza o digitado no Brick; se vier vazio, usa o do seu formulário
  const emailFromBrick = formData?.payer?.email
  const finalEmail = emailFromBrick || email

  const payload = {
    transaction_amount: price,
    description: `Reserva — ${courtName}`,
    payment_method_id: method,              // "pix", "visa", "master", ...
    token: formData.token,                  // só cartão
    installments: formData.installments || 1, // só cartão
    payer: {
      email: finalEmail,
      first_name: fullName?.split(" ")?.[0] || "",
      last_name: fullName?.split(" ")?.slice(1).join(" ") || "",
      identification: { type: "CPF", number: onlyDigits(cpf) },
    },
    metadata: { quadra: courtId, slug, date: isoDate, time, payer_name: fullName, payer_email: finalEmail },
  }

  const res = await fetch(`${window.location.origin}/api/mp/process-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    console.error("process-payment FAIL:", data)
    return { status: "error", message: data?.message || "Falha no pagamento." }
  }

  // PIX: exibir QR e copia-e-cola
  if (method === "pix") {
    const td = data?.point_of_interaction?.transaction_data
    const base64 = td?.qr_code_base64
    const code = td?.qr_code

    if (base64 || code) {
      setPixQrBase64(base64 ? `data:image/png;base64,${base64}` : "")
      setPixCode(code || "")
      setPixModalOpen(true)
      return { status: "success", message: "PIX gerado. Escaneie o QR ou copie o código." }
    }

    // Se não veio ainda, trate como pendente (webhook confirmará)
    return { status: "success", message: "Pagamento PIX criado. Aguarde a confirmação." }
  }

  // Cartão / débito
  if (data.status === "approved" || data.status === "authorized") {
    router.push(`/sucesso?payment=${data.id}`)
    return { status: "success", message: "Pagamento aprovado." }
  }
  if (data.status === "in_process" || data.status === "pending") {
    router.push(`/pendente?payment=${data.id}`)
    return { status: "success", message: "Pagamento em análise." }
  }

  return { status: "error", message: "Pagamento não aprovado." }
}, [price, courtName, email, fullName, cpf, courtId, slug, isoDate, time, router])

  // ---- UI ----
  return (
    <div className="max-w-6xl mx-auto p-4">
      <button onClick={() => router.back()} className="mb-4 flex items-center text-sm hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ESQUERDA */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamento (Teste) — Bricks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados do responsável */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Dados do responsável pela reserva
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome completo</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pagamento (BRICK) */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Pagamento
                </h3>

                {sdkError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{sdkError}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-lg border p-3">
                  {canRenderBrick ? (
                    <Payment
                      initialization={{ amount: price, payer: { email } }}
                      onSubmit={onSubmitPayment}
                      onError={(err: any) => console.error("Brick error:", err)}
                      customization={{
                        paymentMethods: {
                          creditCard: "all",
                          debitCard: "all",
                          boleto: "all",
                          bankTransfer: "all", // habilita PIX no BR
                        },
                      }}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {price <= 0 ? "Preço inválido." : "Preparando formulário de pagamento..."}
                    </div>
                  )}
                </div>

                <Alert className="bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ambiente de <strong>teste</strong>. Use cartões/chaves de teste do Mercado Pago.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              {/* Termos */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(Boolean(v))} />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Li e concordo com os <span className="underline cursor-pointer">Termos de Uso</span> e a{" "}
                    <span className="underline cursor-pointer">Política de Privacidade</span>.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Política de cancelamento */}
          <Card className="shadow-sm border-0 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Política de Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Cancelamentos até 24h antes: reembolso integral.</p>
              <p>• Menos de 24h: cobrança de 50% do valor.</p>
              <p>• Não comparecimento: sem reembolso.</p>
            </CardContent>
          </Card>
        </div>

        {/* DIREITA (resumo) */}
        <div className="space-y-6">
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                  <Image src={courtImage || "/placeholder.svg"} alt={courtName} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{courtName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {courtLocation}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  <span>{formatDateBR(isoDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{time || "—"}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valor</span>
                <span className="font-semibold">R$ {price.toFixed(2)}</span>
              </div>

              <Badge variant="outline" className="w-full justify-center gap-2">
                <Shield className="h-4 w-4" /> Pagamento seguro Mercado Pago
              </Badge>
            </CardContent>
          </Card>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Precisando de nota fiscal? Solicite após a confirmação.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Modal PIX */}
      <Dialog open={pixModalOpen} onOpenChange={setPixModalOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Pague com PIX</DialogTitle>
      <DialogDescription>Escaneie o QR ou use o código copia-e-cola.</DialogDescription>
    </DialogHeader>

    <div className="space-y-3">
      {pixQrBase64 ? (
        <img src={pixQrBase64} alt="QR Code do PIX" className="mx-auto rounded-md border" />
      ) : (
        <div className="text-sm text-muted-foreground">Gerando QR Code...</div>
      )}

      {pixCode && (
        <div className="space-y-2">
          <Label>Código copia e cola</Label>
          <div className="flex gap-2">
            <Input readOnly value={pixCode} onFocus={(e) => e.currentTarget.select()} />
            <Button type="button" onClick={copyPix} variant="secondary">
              <CopyIcon className="h-4 w-4 mr-1" /> {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Após concluir o pagamento no seu banco, a confirmação pode levar alguns instantes.
      </p>
    </div>
  </DialogContent>
</Dialog>
    </div>
  )
}
