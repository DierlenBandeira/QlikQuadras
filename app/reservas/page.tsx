"use client"

import { useState } from "react"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for reservations
const mockReservations = [
  {
    id: 1,
    court: "Natu Sport",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    status: "confirmada",
    price: 150,
    location: "Centro, São Paulo",
  },
  {
    id: 2,
    court: "Chute Certo",
    date: "2024-01-18",
    time: "19:00 - 21:00",
    status: "pendente",
    price: 200,
    location: "Vila Madalena, São Paulo",
  },
  {
    id: 3,
    court: "Beach Sports",
    date: "2024-01-22",
    time: "16:00 - 18:00",
    status: "confirmada",
    price: 120,
    location: "Copacabana, Rio de Janeiro",
  },
  {
    id: 4,
    court: "Centro Esportivo Elite",
    date: "2024-01-25",
    time: "20:00 - 22:00",
    status: "cancelada",
    price: 180,
    location: "Barra da Tijuca, Rio de Janeiro",
  },
]

export default function ReservasPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Check if date has reservations
  const hasReservation = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockReservations.some((reservation) => reservation.date === dateStr)
  }

  // Get reservations for selected date
  const getReservationsForDate = (dateStr: string) => {
    return mockReservations.filter((reservation) => reservation.date === dateStr)
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"] // alterando de nomes completos para apenas primeiras letras

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-black text-white" // Alterando de bg-green-500 para bg-black
      case "pendente":
        return "bg-yellow-500"
      case "cancelada":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmada":
        return "Confirmada"
      case "pendente":
        return "Pendente"
      case "cancelada":
        return "Cancelada"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/30 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="border-primary-200 hover:bg-primary-50 bg-white text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-12 h-12 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-800 font-display">Minhas Reservas</h1>
            <p className="text-secondary-600">Gerencie suas reservas de quadras</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card className="bg-white border-primary-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-secondary-800 font-display">
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousMonth}
                    className="border-primary-200 hover:bg-primary-50 bg-white text-primary-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="border-primary-200 hover:bg-primary-50 bg-white text-primary-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-secondary-600 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="p-2"></div>
                  }

                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const hasRes = hasReservation(day)
                  const isSelected = selectedDate === dateStr

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        p-2 text-sm rounded-lg transition-all relative
                        ${
                          isSelected
                            ? "bg-accent text-secondary-800 font-bold"
                            : hasRes
                              ? "bg-accent/20 text-accent hover:bg-accent/30"
                              : "text-secondary-600 hover:bg-primary-50"
                        }
                      `}
                    >
                      {day}
                      {hasRes && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary-800 font-display">
              {selectedDate ? `Reservas para ${selectedDate}` : "Todas as Reservas"}
            </h2>

            <div className="space-y-4">
              {(selectedDate ? getReservationsForDate(selectedDate) : mockReservations).map((reservation) => (
                <Card key={reservation.id} className="bg-white border-primary-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-secondary-800">{reservation.court}</h3>
                        <div className="flex items-center gap-2 text-secondary-600 text-sm mt-1">
                          <MapPin className="h-4 w-4" />
                          {reservation.location}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(reservation.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Clock className="h-4 w-4" />
                        {reservation.time}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-200">
                      <span className="text-lg font-bold text-accent">R$ {reservation.price}</span>
                      <div className="flex gap-2">
                        {reservation.status === "confirmada" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-white"
                          >
                            Cancelar
                          </Button>
                        )}
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-secondary-800 font-semibold">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {selectedDate && getReservationsForDate(selectedDate).length === 0 && (
                <Card className="bg-white border-primary-200 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600">Nenhuma reserva encontrada para esta data</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
