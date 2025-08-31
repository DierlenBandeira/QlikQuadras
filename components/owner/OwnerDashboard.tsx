"use client"

import { useMemo, useState } from "react"
import OwnerHero from "@/components/owner/OwnerHero"
import StatsGrid from "@/components/owner/StatsGrid"
import PendingApprovals from "@/components/owner/PendingApprovals"
import ReservationsTable from "@/components/owner/ReservationsTable"
import OwnerCalendar from "@/components/owner/OwnerCalendar"

import type { ReservaRow } from "@/app/_data/reservas"
import type { Reservation } from "@/type/owner" // << ajuste: singular
import { toReservation, toPendingApproval } from "@/lib/mappers/reservas"

// helpers de data
const TZ = "America/Sao_Paulo"
function ymdKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function parseISO(v: string) {
  const t = Date.parse(v)
  return isNaN(t) ? null : new Date(t)
}

export default function OwnerDashboard({
  initialReservations,
  initialApprovals,
  quadrasAtivas, // << novo
}: {
  initialReservations: ReservaRow[]
  initialApprovals:   ReservaRow[]
  quadrasAtivas:      number
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Para o calendário (se ele espera start/end)
  const reservationsForCalendar = useMemo(() => {
    return (initialReservations ?? []).map((r) => ({
      ...r,
      start: r.start_at,
      end: r.end_at,
    }))
  }, [initialReservations])

  // Para a tabela: filtra por dia usando start_at e mapeia para Reservation (tipos da UI)
  const itemsForTable: Reservation[] = useMemo(() => {
    const base = selectedDate
      ? (initialReservations ?? []).filter((r) => {
          const d = parseISO(r.start_at)
          return d ? ymdKey(d) === ymdKey(selectedDate) : false
        })
      : (initialReservations ?? [])

    return base.map(toReservation)
  }, [selectedDate, initialReservations])

  // Para os cards/estatísticas: já no formato da UI
  const mappedReservations = useMemo(
    () => (initialReservations ?? []).map(toReservation),
    [initialReservations]
  )
  const mappedApprovals = useMemo(
    () => (initialApprovals ?? []).map(toPendingApproval),
    [initialApprovals]
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <OwnerHero />

      <StatsGrid
        reservations={mappedReservations}
        approvals={mappedApprovals}
        quadrasAtivas={quadrasAtivas} // << passa para o card
      />

      <section>
        <PendingApprovals initial={mappedApprovals} />
      </section>

      <section className="pt-2 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Últimas Reservas (com filtro por dia selecionado) */}
          <div className="space-y-3 order-2 md:order-1">
            {selectedDate && (
              <div className="text-sm text-muted-foreground">
                Mostrando reservas de{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  timeZone: TZ,
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(selectedDate)}{" "}
                —{" "}
                <button className="underline" onClick={() => setSelectedDate(null)}>
                  limpar filtro
                </button>
              </div>
            )}
            <ReservationsTable items={itemsForTable} />
          </div>

          {/* Calendário (direita no desktop) */}
          <div className="order-1 md:order-2">
            <OwnerCalendar
              reservations={reservationsForCalendar}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
