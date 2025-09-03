// app/quadra/[slug]/components/BookingSidebar.tsx
"use client"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { addOneHourLabel } from "./utils"

type Props = {
  price: number
  availableHours: string[]
  selectedDate?: Date
  selectedTime: string
  setSelectedDate: (d?: Date) => void
  setSelectedTime: (t: string) => void
  isDateUnavailable: (date: Date) => boolean
  isTimeOccupied: (date: Date | undefined, time: string) => boolean
  onReserve: () => void
}

export default function BookingSidebar({
  price,
  availableHours,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  isDateUnavailable,
  isTimeOccupied,
  onReserve,
}: Props) {
  // hoje 00:00 para bloquear passado
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  return (
    <Card className="sticky top-24 hidden lg:block">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold">R$ {price}</span>
            <span className="text-muted-foreground">/hora</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Selecione a data</label>
            <div className="border border-gray-200 rounded-xl p-2 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                disabled={(date) => date < today || isDateUnavailable(date)}
                className="w-full"
                fixedWeeks
                showOutsideDays={false}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Horários disponíveis</label>
            <div className="grid grid-cols-2 gap-2">
              {availableHours.map((hour) => {
                const isOcc = isTimeOccupied(selectedDate, hour)
                const active = selectedTime === hour
                return (
                  <Button
                    key={hour}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => !isOcc && setSelectedTime(hour)}
                    disabled={isOcc}
                    className={`h-auto py-2 px-3 flex flex-col gap-1 ${
                      isOcc ? "bg-red-100 border-red-300 text-red-600 cursor-not-allowed hover:bg-red-100" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{hour}</span>
                    {isOcc && <span className="text-xs">Ocupado</span>}
                  </Button>
                )
              })}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data:</span>
                <span className="font-medium">{selectedDate.toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Horário:</span>
                <span className="font-medium">{addOneHourLabel(selectedTime)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>R$ {price}</span>
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" disabled={!selectedDate || !selectedTime} onClick={onReserve}>
            {selectedDate && selectedTime ? "Reservar agora" : "Selecione data e horário"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
