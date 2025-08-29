"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"

type OwnerCalendarProps = {
  reservations: any[]
  selectedDate: Date | null
  onSelectDate: (d: Date | null) => void
}

// --- helpers de data ---
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function getDaysInMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() }
function getFirstDayOfMonth(d: Date) { return startOfMonth(d).getDay() } // 0..6 (Dom..Sáb)
function getMonthName(d: Date) { return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) }
function ymdKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function parseToDateSafe(value: any): Date | null {
  if (value instanceof Date) return value
  if (typeof value === "string") {
    const t = Date.parse(value)
    return isNaN(t) ? null : new Date(t)
  }
  return null
}

export default function OwnerCalendar({ reservations, selectedDate, onSelectDate }: OwnerCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // conjunto de dias com reservas no mês visível
  const bookedDays = useMemo(() => {
    const set = new Set<string>()
    const m = currentDate.getMonth()
    const y = currentDate.getFullYear()
    for (const r of reservations) {
      // ajuste o campo conforme seu mock: date | start | startTime
      const d =
        parseToDateSafe((r as any).date) ??
        parseToDateSafe((r as any).start) ??
        parseToDateSafe((r as any).startTime)
      if (!d) continue
      if (d.getMonth() === m && d.getFullYear() === y) set.add(ymdKey(d))
    }
    return set
  }, [reservations, currentDate])

  function navigateMonth(dir: "prev" | "next") {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    setCurrentDate(new Date(y, dir === "prev" ? m - 1 : m + 1, 1))
    onSelectDate(null) // limpa filtro ao trocar de mês
  }

  function hasBookingOnDate(day: number) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return bookedDays.has(ymdKey(d))
  }

  function handleDateClick(day: number) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // toggle do filtro
    onSelectDate(selectedDate && ymdKey(selectedDate) === ymdKey(d) ? null : d)
  }

  const isToday = (day: number) => {
    const now = new Date()
    return (
      now.getDate() === day &&
      now.getMonth() === currentDate.getMonth() &&
      now.getFullYear() === currentDate.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Calendário de Reservas
            </CardTitle>
            <CardDescription>Clique em uma data para ver os horários disponíveis</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              ←
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center capitalize">
              {getMonthName(currentDate)}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              →
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* grid do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {/* cabeçalhos */}
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-sm font-medium text-muted-foreground p-2">
                {d}
              </div>
            ))}
            {/* espaços antes do dia 1 */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {/* dias */}
            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, idx) => {
              const day = idx + 1
              const booked = hasBookingOnDate(day)
              const today = isToday(day)
              const selected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={[
                    "p-2 text-sm rounded-lg transition-colors hover:bg-muted",
                    booked ? "bg-primary text-primary-foreground font-semibold" : "",
                    today ? "ring-2 ring-accent" : "",
                    selected ? "outline outline-2 outline-offset-2 outline-primary" : "",
                  ].join(" ")}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 bg-primary rounded mr-2" />
              Dias com reservas • Clique para ver horários
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
