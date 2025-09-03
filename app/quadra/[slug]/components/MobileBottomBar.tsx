"use client"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

type Props = {
  price: number
  selectedDate?: Date
  selectedTime: string
  onOpen: () => void
}

export default function MobileBottomBar({ price, selectedDate, selectedTime, onOpen }: Props) {
  // opcional: moeda bonitinha
  const priceLabel = useMemo(() => {
    try {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
    } catch {
      return `R$ ${price}`
    }
  }, [price])

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 safe-area-pb">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-bold">{priceLabel}/hora</div>
          {selectedDate && selectedTime && (
            <div className="text-xs text-muted-foreground">
              {selectedDate?.toLocaleDateString("pt-BR")} às {selectedTime}
            </div>
          )}
        </div>
        <Button onClick={onOpen} className="px-6" aria-label="Abrir seleção de data e horário">
          Reservar
        </Button>
      </div>
    </div>
  )
}
