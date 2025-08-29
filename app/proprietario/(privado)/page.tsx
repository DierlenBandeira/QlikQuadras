"use client"

import { useMemo, useState } from "react"
import OwnerHero from "@/components/owner/OwnerHero"
import StatsGrid from "@/components/owner/StatsGrid"
import PendingApprovals from "@/components/owner/PendingApprovals"
import ReservationsTable from "@/components/owner/ReservationsTable"
import OwnerCalendar from "@/components/owner/OwnerCalendar"

import { mockReservations } from "@/lib/mock/reservations"
import { mockPendingApprovals } from "@/lib/mock/pending-approvals"

// utils simples p/ filtrar por dia
function ymdKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function parseToDateSafe(v: any): Date | null {
  if (v instanceof Date) return v
  if (typeof v === "string") {
    const t = Date.parse(v)
    return isNaN(t) ? null : new Date(t)
  }
  return null
}

export default function ProprietarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const itemsForTable = useMemo(() => {
    if (!selectedDate) return mockReservations
    const key = ymdKey(selectedDate)
    return mockReservations.filter((r: any) => {
      const d =
        parseToDateSafe(r.date) ??
        parseToDateSafe(r.start) ??
        parseToDateSafe(r.startTime)
      return d ? ymdKey(d) === key : false
    })
  }, [selectedDate])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <OwnerHero />
      <StatsGrid reservations={mockReservations} approvals={mockPendingApprovals} />

      {/* Aguardando aprovação em largura total */}
      <section>
        <PendingApprovals initial={mockPendingApprovals} />
      </section>

      {/* Divisão apenas entre Calendário e Últimas Reservas */}
      <section className="pt-2 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Últimas Reservas (com filtro por dia selecionado) */}
          <div className="space-y-3 order-2 md:order-1">
            {selectedDate && (
              <div className="text-sm text-muted-foreground">
                Mostrando reservas de{" "}
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                —{" "}
                <button className="underline" onClick={() => setSelectedDate(null)}>
                  limpar filtro
                </button>
              </div>
            )}
            <ReservationsTable items={itemsForTable} />
          </div>

          {/* Calendário (mantenho na direita no desktop) */}
          <div className="order-1 md:order-2">
            <OwnerCalendar
              reservations={mockReservations}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
