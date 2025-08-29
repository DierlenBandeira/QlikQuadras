"use client"

import type { Reservation } from "@/types/owner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("pt-BR")
}
function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function ReservationsTable({ items }: { items: Reservation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Próximas Reservas
        </CardTitle>
        <CardDescription>Jogos agendados para os próximos dias</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            Nenhuma reserva por aqui ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((reserva) => {
              const statusClasses =
                reserva.status === "confirmada"
                  ? "bg-primary text-primary-foreground"
                  : reserva.status === "pendente"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-700"

              return (
                <div key={reserva.id} className="overflow-hidden rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold">{reserva.cliente}</h4>
                        <span className={`rounded-full px-2 py-1 text-xs ${statusClasses}`}>
                          {reserva.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{reserva.quadra}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(reserva.data)} • {reserva.horario}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{formatBRL(reserva.valor)}</p>
                      <p className="text-xs text-muted-foreground">#{reserva.id}</p>
                    </div>
                  </div>

                  {reserva.status === "confirmada" && (
                    <div className="border-t bg-muted/30 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h5 className="mb-2 text-sm font-medium">Dados do Cliente:</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>📧 {reserva.email}</p>
                            <p>📱 {reserva.telefone}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="mb-2 text-sm font-medium">Pagamento:</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>💳 {reserva.metodoPagamento}</p>
                            {reserva.comprovantePagamento && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-1 h-7 bg-transparent text-xs"
                                onClick={() => {
                                  // se houver URL real, use window.open(reserva.comprovantePagamento)
                                  const a = document.createElement("a")
                                  a.href = reserva.comprovantePagamento
                                  a.download = reserva.comprovantePagamento.split("/").pop() || "comprovante.pdf"
                                  document.body.appendChild(a)
                                  a.click()
                                  a.remove()
                                }}
                              >
                                📄 Baixar Comprovante
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
