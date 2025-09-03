// app/quadra/[slug]/CourtDetailsClient.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

import CourtDetailsHeader from "./components/CourtDetailsHeader"
import ImageGallery from "./components/ImageGallery"
import OwnerCard from "./components/OwnerCard"
import CourtTabs from "./components/CourtTabs"
import BookingSidebar from "./components/BookingSidebar"
import MobileBottomBar from "./components/MobileBottomBar"
import BookingDialog from "./components/BookingDialog"

import { Court, OccupiedSlots } from "./components/types"
import { isDateUnavailableFactory, isTimeOccupiedFactory } from "./components/utils"

export default function CourtDetailsClient({
  court, occupiedSlots, unavailableDates, slug,
}: {
  court: Court
  occupiedSlots: OccupiedSlots
  unavailableDates: string[]
  slug: string
}) {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [showAllImages, setShowAllImages] = useState(false)
  const [showBookingCard, setShowBookingCard] = useState(false)

  const totalPrice = court.price

  const isDateUnavailable = isDateUnavailableFactory(unavailableDates)
  const isTimeOccupied = isTimeOccupiedFactory(occupiedSlots)

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) return
    const params = new URLSearchParams({
      quadra: court.id,
      slug,
      date: selectedDate.toISOString(),
      time: selectedTime,
      price: String(totalPrice),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <CourtDetailsHeader />

      <div className="max-w-7xl mx-auto">
        {/* Galeria */}
        <ImageGallery images={court.images} title={court.name} onOpenAll={() => setShowAllImages(true)} />

        {/* Conteúdo */}
        <div className="px-4 py-6 space-y-6 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-3 lg:gap-8 lg:px-6">
          {/* Coluna principal */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            {/* Título + preço/nota */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold mb-2 lg:text-3xl">{court.name}</h1>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                  <div className="text-sm text-muted-foreground">{court.location}</div>
                  <div className="flex items-center gap-1 text-sm">
                    {/* rating opcional — remova se não quiser exibir */}
                    <span className="font-semibold">{court.rating}</span>
                    <span className="text-muted-foreground">({court.reviewCount} avaliações)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">R$ {totalPrice}</span>
                  <span className="text-sm text-muted-foreground">/hora</span>
                </div>
                {/* badge ilustrativo */}
                <div className="text-xs px-3 py-1 rounded-md bg-muted">Disponível</div>
              </div>
            </div>

            <OwnerCard ownerName={court.owner.name} phone={court.owner.phone} />

            <CourtTabs
              description={court.description}
              amenities={court.amenities}
              address={court.address}
            />
          </div>

          {/* Sidebar de reserva (desktop) */}
          <BookingSidebar
            price={totalPrice}
            availableHours={court.availableHours}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
            isDateUnavailable={isDateUnavailable}
            isTimeOccupied={isTimeOccupied}
            onReserve={handleReserve}
          />
        </div>
      </div>

      {/* Barra inferior (mobile) */}
      <MobileBottomBar
        price={totalPrice}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onOpen={() => setShowBookingCard(true)}
      />

      {/* Dialog de reserva (mobile) */}
      <BookingDialog
        open={showBookingCard}
        onOpenChange={setShowBookingCard}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availableHours={court.availableHours}
        price={totalPrice}
        isDateUnavailable={isDateUnavailable}
        isTimeOccupied={isTimeOccupied}
        onReserve={handleReserve}
      />

      {/* Modal: todas as fotos */}
      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas as fotos</h2>
            <button className="p-2" onClick={() => setShowAllImages(false)}>✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto">
            {court.images.map((image, index) => (
              <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                <Image src={image || "/placeholder.svg"} alt={`Foto ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-16 lg:hidden" />
    </div>
  )
}
