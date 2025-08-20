"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  CalendarIcon,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Phone,
  MessageCircle,
  Download,
  Star,
  AlertCircle,
  Home,
  User,
  Settings,
  LogOut,
  Building2,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - em produção viria de uma API
const mockReservations = [
  {
    id: 1,
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    date: "2024-01-20",
    time: "14:00",
    duration: 1,
    price: 120,
    status: "pending", // pending, confirmed, cancelled
    createdAt: "2024-01-19T10:30:00",
    sport: "Futebol",
    players: 10,
  },
  {
    id: 2,
    customerName: "Maria Santos",
    customerPhone: "(11) 88888-8888",
    date: "2024-01-20",
    time: "16:00",
    duration: 1,
    price: 120,
    status: "confirmed",
    createdAt: "2024-01-18T15:20:00",
    sport: "Futebol",
    players: 8,
  },
  {
    id: 3,
    customerName: "Pedro Costa",
    customerPhone: "(11) 77777-7777",
    date: "2024-01-21",
    time: "20:00",
    duration: 1,
    price: 150,
    status: "pending",
    createdAt: "2024-01-19T18:45:00",
    sport: "Futebol",
    players: 12,
  },
  {
    id: 4,
    customerName: "Ana Oliveira",
    customerPhone: "(11) 66666-6666",
    date: "2024-01-22",
    time: "10:00",
    duration: 2,
    price: 200,
    status: "confirmed",
    createdAt: "2024-01-19T09:15:00",
    sport: "Futebol",
    players: 6,
  },
]

const mockStats = {
  totalReservations: 45,
  pendingReservations: 3,
  confirmedReservations: 38,
  cancelledReservations: 4,
  monthlyRevenue: 5400,
  occupancyRate: 78,
  averageRating: 4.8,
  totalReviews: 124,
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reservations, setReservations] = useState(mockReservations)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showReservationDetails, setShowReservationDetails] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [notifications, setNotifications] = useState(mockReservations.filter((r) => r.status === "pending"))

  const handleReservationAction = (reservationId: number, action: "confirm" | "cancel") => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status: action === "confirm" ? "confirmed" : "cancelled" }
          : reservation,
      ),
    )

    // Remove from notifications if it was pending
    setNotifications((prev) => prev.filter((n) => n.id !== reservationId))
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "all") return true
    return reservation.status === filterStatus
  })

  const getReservationsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return reservations.filter((r) => r.date === dateStr)
  }

  const pendingCount = reservations.filter((r) => r.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
                <span className="text-white font-bold">SS</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-secondary-800">Dashboard</h1>
                <p className="text-sm text-secondary-600">Natu Sport</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
              >
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Button>
            </div>

            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 ring-2 ring-primary-200 cursor-pointer hover:ring-primary-300 transition-all">
                  <AvatarFallback className="bg-primary-500 text-white font-semibold">CS</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/perfil" className="flex items-center w-full">
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  <Link href="/proprietario" className="flex items-center w-full">
                    <span>Proprietário</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <Link href="/reservas" className="flex items-center w-full">
                    <span>Minhas Reservas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <Link href="/configuracoes" className="flex items-center w-full">
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="livelo-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Reservas Pendentes</p>
                  <p className="text-2xl font-bold text-secondary-800">{mockStats.pendingReservations}</p>
                </div>
                <div className="h-12 w-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="livelo-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-secondary-800">
                    R$ {mockStats.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="livelo-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Taxa de Ocupação</p>
                  <p className="text-2xl font-bold text-secondary-800">{mockStats.occupancyRate}%</p>
                </div>
                <div className="h-12 w-12 bg-accent/50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="livelo-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-secondary-800">{mockStats.averageRating}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <Card className="livelo-card border-secondary-200 bg-secondary-50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary-800">
                <AlertCircle className="h-5 w-5" />
                Novas Reservas Pendentes ({notifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-secondary-800">{reservation.customerName}</h4>
                        <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                          {reservation.sport}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(reservation.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reservation.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          R$ {reservation.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setShowReservationDetails(true)
                        }}
                        className="bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReservationAction(reservation.id, "confirm")}
                        className="btn-primary"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReservationAction(reservation.id, "cancel")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Recusar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="livelo-card lg:col-span-1 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary-500" />
                Calendário de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiers={{
                  hasReservations: (date) => getReservationsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasReservations: {
                    backgroundColor: "hsl(var(--primary-50))", // Use primary-50 for background
                    color: "hsl(var(--primary-600))", // Use primary-600 for text
                    fontWeight: "bold",
                  },
                }}
              />

              {/* Reservations for selected date */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-sm">Reservas para {selectedDate.toLocaleDateString("pt-BR")}</h4>
                {getReservationsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-secondary-600">Nenhuma reserva para este dia</p>
                ) : (
                  <div className="space-y-2">
                    {getReservationsForDate(selectedDate).map((reservation) => (
                      <div key={reservation.id} className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{reservation.time}</p>
                            <p className="text-xs text-secondary-600">{reservation.customerName}</p>
                          </div>
                          <Badge
                            variant={
                              reservation.status === "confirmed"
                                ? "default"
                                : reservation.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {reservation.status === "confirmed"
                              ? "Confirmada"
                              : reservation.status === "pending"
                                ? "Pendente"
                                : "Cancelada"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <Card className="livelo-card lg:col-span-2 animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary-500" />
                  Todas as Reservas
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="confirmed">Confirmadas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-secondary-800">{reservation.customerName}</h4>
                          <Badge
                            variant={
                              reservation.status === "confirmed"
                                ? "default"
                                : reservation.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {reservation.status === "confirmed"
                              ? "Confirmada"
                              : reservation.status === "pending"
                                ? "Pendente"
                                : "Cancelada"}
                          </Badge>
                          <Badge variant="outline" className="bg-transparent">
                            {reservation.sport}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(reservation.date).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {reservation.players} jogadores
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            R$ {reservation.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedReservation(reservation)
                            setShowReservationDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`tel:${reservation.customerPhone}`)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`https://wa.me/${reservation.customerPhone.replace(/\D/g, "")}`)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        {reservation.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleReservationAction(reservation.id, "confirm")}
                              className="btn-primary"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReservationAction(reservation.id, "cancel")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reservation Details Modal */}
      <Dialog open={showReservationDetails} onOpenChange={setShowReservationDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{selectedReservation.customerName}</h3>
                <Badge
                  variant={
                    selectedReservation.status === "confirmed"
                      ? "default"
                      : selectedReservation.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {selectedReservation.status === "confirmed"
                    ? "Confirmada"
                    : selectedReservation.status === "pending"
                      ? "Pendente"
                      : "Cancelada"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-600">Data</p>
                  <p className="font-medium">{new Date(selectedReservation.date).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Horário</p>
                  <p className="font-medium">{selectedReservation.time}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Duração</p>
                  <p className="font-medium">{selectedReservation.duration}h</p>
                </div>
                <div>
                  <p className="text-secondary-600">Valor</p>
                  <p className="font-medium">R$ {selectedReservation.price}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Esporte</p>
                  <p className="font-medium">{selectedReservation.sport}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Jogadores</p>
                  <p className="font-medium">{selectedReservation.players}</p>
                </div>
              </div>

              <div>
                <p className="text-secondary-600 text-sm">Telefone</p>
                <p className="font-medium">{selectedReservation.customerPhone}</p>
              </div>

              <div>
                <p className="text-secondary-600 text-sm">Solicitado em</p>
                <p className="font-medium">{new Date(selectedReservation.createdAt).toLocaleString("pt-BR")}</p>
              </div>

              {selectedReservation.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 btn-primary"
                    onClick={() => {
                      handleReservationAction(selectedReservation.id, "confirm")
                      setShowReservationDetails(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aceitar Reserva
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleReservationAction(selectedReservation.id, "cancel")
                      setShowReservationDetails(false)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Recusar
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => window.open(`tel:${selectedReservation.customerPhone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => window.open(`https://wa.me/${selectedReservation.customerPhone.replace(/\D/g, "")}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
