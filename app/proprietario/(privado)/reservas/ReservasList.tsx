"use client"

import { cancelReservationAction } from "@/app/proprietario/reservas/actions"
import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"


type Row = {
  id: string
  quadra_id: string
  owner_id: string
  user_id: string
  quadra: string | null
  cliente: string | null
  email: string | null
  telefone: string | null
  cpf: string | null
  start_at: string
  end_at: string
  price_cents: number | null
  status: "confirmed" | "canceled" | "pending"
  metodo_pagamento: string | null
  comprovante_pagamento: string | null
  data_solicitacao: string | null
}

function brMoney(cents: number | null | undefined) {
  const v = (cents ?? 0) / 100
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

function fmtRange(startISO: string, endISO: string) {
  // Formata no CLIENTE (evita mismatch de hidratação)
  const tz = "America/Sao_Paulo"
  const start = new Date(startISO)
  const end = new Date(endISO)
  const dia = new Intl.DateTimeFormat("pt-BR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(start)
  const h1 = new Intl.DateTimeFormat("pt-BR", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(start)
  const h2 = new Intl.DateTimeFormat("pt-BR", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(end)
  return { dia, h1, h2 }
}

export default function ReservasList({ initialRows }: { initialRows: Row[] }) {
  const [isPending, startTransition] = useTransition()

  if (!initialRows.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Nenhuma reserva por aqui ainda.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {initialRows.map((r) => {
        const { dia, h1, h2 } = fmtRange(r.start_at, r.end_at)
        const statusLabel =
          r.status === "confirmed" ? "Confirmada" :
          r.status === "pending"   ? "Pendente"   :
                                     "Cancelada"

        const badgeVariant =
          r.status === "confirmed" ? "default" :
          r.status === "pending"   ? "secondary" :
                                     "outline"

        return (
          <Card key={r.id} className="rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{r.cliente ?? "Cliente"}</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {r.email ?? "—"} {r.telefone ? ` · ${r.telefone}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{brMoney(r.price_cents)}</div>
                  <Badge variant={badgeVariant} className="mt-1">{statusLabel}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{r.quadra ?? "Quadra"}</div>
                <div className="text-muted-foreground">{dia} · {h1} – {h2}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Pagamento:</span>{" "}
                  {r.metodo_pagamento ?? "—"}
                </div>

                {r.comprovante_pagamento ? (
                  <a
                    href={r.comprovante_pagamento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm underline underline-offset-4"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Comprovante
                  </a>
                ) : null}
              </div>

              <div className="pt-1">
                {r.status === "confirmed" ? (
                  <form
                    action={async (formData: FormData) => {
                      startTransition(async () => {
                        await cancelReservationAction(formData)
                      })
                    }}
                  >
                    <input type="hidden" name="id" value={r.id} />
                    <Button type="submit" variant="outline" className="rounded-full" disabled={isPending}>
                      {isPending ? "Cancelando..." : "Cancelar reserva"}
                    </Button>
                  </form>
                ) : (
                  <Button variant="outline" className="rounded-full" disabled>
                    {r.status === "pending" ? "Aguardando aprovação" : "Reserva cancelada"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
