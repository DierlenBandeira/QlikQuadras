// app/quadra/[slug]/components/BookingDialog.tsx
"use client"
import { useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { addOneHourLabel } from "./utils"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  selectedDate?: Date
  setSelectedDate: (d?: Date) => void
  selectedTime: string
  setSelectedTime: (t: string) => void
  availableHours: string[]
  price: number
  isDateUnavailable: (date: Date) => boolean
  isTimeOccupied: (date: Date | undefined, time: string) => boolean
  onReserve: () => void
}

export default function BookingDialog({
  open,
  onOpenChange,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableHours,
  price,
  isDateUnavailable,
  isTimeOccupied,
  onReserve,
}: Props) {
  // hoje às 00:00 para comparação estável (bloquear passado)
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Reservar quadra</h2>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Calendário */}
          <div>
            <label className="text-sm font-medium mb-3 block">Selecione a data</label>
            <div className="border border-gray-200 rounded-xl p-2 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                // bloqueia dias anteriores a hoje e mantém as indisponibilidades vindas do servidor
                disabled={(date) => date < today || isDateUnavailable(date)}
                className="w-full"
                fixedWeeks
                showOutsideDays={false}
              />
            </div>
          </div>

          {/* Horários */}
          <div>
            <label className="text-sm font-medium mb-3 block">Horários disponíveis</label>
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
                    className={`h-auto py-3 px-2 flex flex-col gap-1 ${
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/20 flex-shrink-0">
          {selectedDate && selectedTime && (
            <div className="p-3 bg-background rounded-lg mb-3 border">
              <div className="flex justify-between text-sm mb-1">
                <span>Data:</span>
                <span className="font-medium">{selectedDate.toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Horário:</span>
                <span className="font-medium">{addOneHourLabel(selectedTime)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>R$ {price}</span>
              </div>
            </div>
          )}

          <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={onReserve} size="lg">
            {selectedDate && selectedTime ? "Continuar para pagamento" : "Selecione data e horário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
