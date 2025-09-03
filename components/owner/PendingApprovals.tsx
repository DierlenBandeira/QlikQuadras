"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { PendingApproval } from "@/types/owner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertCircle, Check, X, Mail, Phone, IdCard,
  Calendar as CalendarIcon, Clock, BadgeDollarSign
} from "lucide-react"

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("pt-BR")
}
function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function PendingApprovals({ initial }: { initial: PendingApproval[] }) {
  const [items, setItems] = useState<PendingApproval[]>(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()

  async function sendStatus(id: string, status: "confirmed" | "canceled") {
    const res = await fetch(`/api/reservas/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Falha ao atualizar" }))
      throw new Error(error || "Não foi possível salvar no servidor.")
    }
  }

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    const ok = confirm(
      action === "approve" ? "Aprovar pagamento na quadra?" : "Rejeitar esta solicitação?"
    )
    if (!ok) return

    const newStatus: "confirmed" | "canceled" =
      action === "approve" ? "confirmed" : "canceled"

    // snapshot IMUTÁVEL p/ rollback seguro
    const snapshot = [...items]
    setLoadingId(id)
    // otimista: remove da lista (tela só mostra pendentes)
    setItems(prev => prev.filter(x => x.id !== id))

    try {
      await sendStatus(id, newStatus)
      // Revalida Server Components (cards/contagens) após sucesso
      startTransition(() => router.refresh())
    } catch (err) {
      // rollback
      setItems(snapshot)
      alert((err as Error).message)
    } finally {
      setLoadingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="mb-8 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="h-5 w-5" />
            Aprovações Pendentes - Pagamento na Quadra
          </CardTitle>
          <CardDescription>
            Solicitações de reserva que precisam da sua aprovação para pagamento presencial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            Nenhuma aprovação pendente no momento.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="h-5 w-5" />
          Aprovações Pendentes - Pagamento na Quadra
        </CardTitle>
        <CardDescription>
          Solicitações de reserva que precisam da sua aprovação para pagamento presencial
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {items.map((sol) => (
            <div key={sol.id} className="rounded-lg border bg-amber-50/50 p-4">
              <div className="mb-4 flex items-start justify-between">
                {/* ESQUERDA */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="text-lg font-semibold">{sol.cliente}</h4>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                      Aguardando Aprovação
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="space-y-1 text-muted-foreground">
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{sol.email}</p>
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{sol.telefone}</p>
                      <p className="flex items-center gap-2"><IdCard className="h-4 w-4" />{sol.cpf}</p>
                    </div>

                    <div className="space-y-1 text-muted-foreground">
                      <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" />{formatDate(sol.data)}</p>
                      <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{sol.horario}</p>
                      <p className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4" />{formatBRL(sol.valor)}</p>
                    </div>
                  </div>
                </div>

                {/* DIREITA */}
                <div className="text-right">
                  <p className="text-lg font-semibold">{formatBRL(sol.valor)}</p>
                  <p className="text-xs text-muted-foreground">#{sol.id}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    onClick={() => handleApproval(sol.id, "approve")}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-60"
                    disabled={loadingId === sol.id || isRefreshing}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    {loadingId === sol.id ? "Aprovando..." : "Aprovar Pagamento na Quadra"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproval(sol.id, "reject")}
                    className="border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    disabled={loadingId === sol.id || isRefreshing}
                  >
                    <X className="mr-1 h-4 w-4" />
                    {loadingId === sol.id ? "Rejeitando..." : "Rejeitar Solicitação"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
