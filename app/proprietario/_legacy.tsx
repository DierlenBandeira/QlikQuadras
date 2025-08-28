"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  MapPin,
  DollarSign,
  Camera,
  Plus,
  UserPlus,
  LogIn,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Check,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"


    const handleDateClick = (day: number) => {
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      setSelectedDate(clickedDate)
      setShowTimeSlots(true)
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image src="/clik-quadras-logo-transparent.png" alt="Clik Quadras" width={140} height={45} />
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentView("options")
                    setIsLoggedIn(false)
                  }}
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Painel do Proprietário</h1>
              <p className="text-muted-foreground">Gerencie suas quadras e acompanhe as reservas</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Reservas</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receita do Mês</p>
                      <p className="text-2xl font-bold">R$ 600</p>
                    </div>
                    <div className="p-2 bg-secondary/10 rounded-full">
                      <DollarSign className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="p-2 bg-accent/10 rounded-full">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                      <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {pendingApprovals.length > 0 && (
              <Card className="mb-8 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                    Aprovações Pendentes - Pagamento na Quadra
                  </CardTitle>
                  <CardDescription>
                    Solicitações de reserva que precisam da sua aprovação para pagamento presencial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.map((solicitacao) => (
                      <div key={solicitacao.id} className="border rounded-lg p-4 bg-amber-50/50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{solicitacao.cliente}</h4>
                              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                                Aguardando Aprovação
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">📧 {solicitacao.email}</p>
                                <p className="text-muted-foreground">📱 {solicitacao.telefone}</p>
                                <p className="text-muted-foreground">🆔 {solicitacao.cpf}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  📅 {new Date(solicitacao.data).toLocaleDateString("pt-BR")}
                                </p>
                                <p className="text-muted-foreground">⏰ {solicitacao.horario}</p>
                                <p className="text-muted-foreground">💰 R$ {solicitacao.valor}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">R$ {solicitacao.valor}</p>
                            <p className="text-xs text-muted-foreground">#{solicitacao.id}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            size="sm"
                            onClick={() => handleApproval(solicitacao.id, "approve")}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprovar Pagamento na Quadra
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(solicitacao.id, "reject")}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeitar Solicitação
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reservations List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximas Reservas
                  </CardTitle>
                  <CardDescription>Jogos agendados para os próximos dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReservations.map((reserva) => (
                      <div key={reserva.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{reserva.cliente}</h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  reserva.status === "confirmada"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {reserva.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{reserva.quadra}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reserva.data).toLocaleDateString("pt-BR")} • {reserva.horario}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R$ {reserva.valor}</p>
                            <p className="text-xs text-muted-foreground">#{reserva.id}</p>
                          </div>
                        </div>

                        {reserva.status === "confirmada" && (
                          <div className="border-t bg-muted/30 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">Dados do Cliente:</h5>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>📧 {reserva.email}</p>
                                  <p>📱 {reserva.telefone}</p>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-2">Pagamento:</h5>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>💳 {reserva.metodoPagamento}</p>
                                  {reserva.comprovantePagamento && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-1 h-7 text-xs bg-transparent"
                                      onClick={() => {
                                        // Simular download do comprovante
                                        const link = document.createElement("a")
                                        link.href = "#"
                                        link.download = reserva.comprovantePagamento
                                        link.click()
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
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Calendar with Bookings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
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
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Day headers */}
                      {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                        <div key={index} className="text-center text-sm font-medium text-muted-foreground p-2">
                          {day}
                        </div>
                      ))}

                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                        <div key={index} className="p-2"></div>
                      ))}

                      {/* Calendar days */}
                      {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                        const day = index + 1
                        const hasBooking = hasBookingOnDate(day)
                        const isToday =
                          new Date().getDate() === day &&
                          new Date().getMonth() === currentDate.getMonth() &&
                          new Date().getFullYear() === currentDate.getFullYear()

                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`
                              p-2 text-sm rounded-lg transition-colors hover:bg-muted
                              ${hasBooking ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}
                              ${isToday ? "ring-2 ring-accent" : ""}
                            `}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>

                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="inline-block w-3 h-3 bg-primary rounded mr-2"></span>
                        Dias com reservas • Clique para ver horários
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Time Slots Modal */}
        {showTimeSlots && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Horários - {selectedDate.toLocaleDateString("pt-BR")}</CardTitle>
                    <CardDescription>Visualize todos os horários disponíveis e ocupados</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowTimeSlots(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generateTimeSlots().map((timeSlot) => {
                    const isBooked = isTimeSlotBooked(timeSlot, selectedDate)
                    const booking = getBookingForTimeSlot(timeSlot, selectedDate)

                    return (
                      <div
                        key={timeSlot}
                        className={`
                          p-4 rounded-lg border transition-colors
                          ${isBooked ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{timeSlot}</span>
                          <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${
                              isBooked ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                            }
                          `}
                          >
                            {isBooked ? "Ocupado" : "Livre"}
                          </span>
                        </div>

                        {isBooked && booking && (
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <strong>Cliente:</strong> {booking.cliente}
                            </p>
                            <p>
                              <strong>Status:</strong> {booking.status}
                            </p>
                            <p>
                              <strong>Valor:</strong> R$ {booking.valor}
                            </p>
                            <p>
                              <strong>ID:</strong> #{booking.id}
                            </p>
                          </div>
                        )}

                        {!isBooked && <p className="text-sm text-muted-foreground">Horário disponível para reserva</p>}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Horários Ocupados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded"></div>
                      <span>Horários Livres</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  const OptionsView = () => (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/clik-quadras-logo-transparent.png" alt="Clik Quadras" width={140} height={45} />
            </Link>
            <Link href="/">
              <Button variant="outline">Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Área do Proprietário</h1>
            <p className="text-muted-foreground">Gerencie suas quadras e transforme seu espaço em uma fonte de renda</p>
          </div>

          <div className="grid gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCurrentView("cadastro")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Cadastre Sua Quadra</CardTitle>
                <CardDescription>
                  Primeira vez aqui? Cadastre sua quadra e comece a receber reservas hoje mesmo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setCurrentView("cadastro")}>
                  Começar Cadastro
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("acesso")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-secondary/10 rounded-full w-fit">
                  <LogIn className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Acesse sua Quadra</CardTitle>
                <CardDescription>Já tem uma conta? Faça login para gerenciar suas quadras e reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setCurrentView("acesso")}>
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const AcessoView = () => (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/clik-quadras-logo-transparent.png" alt="Clik Quadras" width={140} height={45} />
            </Link>
            <Button variant="outline" onClick={() => setCurrentView("options")}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acesse sua Conta</h1>
            <p className="text-muted-foreground">Entre com suas credenciais para gerenciar suas quadras</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login do Proprietário</CardTitle>
              <CardDescription>Digite seus dados para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">E-mail</Label>
                <Input id="email-login" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha-login">Senha</Label>
                <Input id="senha-login" type="password" placeholder="Sua senha" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="lembrar" />
                  <Label htmlFor="lembrar" className="text-sm">
                    Lembrar de mim
                  </Label>
                </div>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setIsLoggedIn(true)
                  setCurrentView("dashboard")
                }}
              >
                Entrar
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem conta?{" "}
                  <button onClick={() => setCurrentView("cadastro")} className="text-primary hover:underline">
                    Cadastre-se aqui
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const CadastroView = () => (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/clik-quadras-logo-transparent.png" alt="Clik Quadras" width={140} height={45} />
            </Link>
            <Button variant="outline" onClick={() => setCurrentView("options")}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Cadastre sua Quadra</h1>
            <p className="text-muted-foreground">
              Transforme sua quadra em uma fonte de renda. Cadastre-se como proprietário e comece a receber reservas
              hoje mesmo.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Informações da Quadra
              </CardTitle>
              <CardDescription>Preencha os dados da sua quadra para disponibilizá-la para locação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Esporte */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Tipo de Esporte *</Label>
                <p className="text-sm text-muted-foreground">
                  Selecione um ou mais tipos de esporte disponíveis na sua quadra
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                  {[
                    { value: "futebol7", label: "Futebol 7" },
                    { value: "salao", label: "Salão" },
                    { value: "volei", label: "Volei" },
                    { value: "basquete", label: "Basquete" },
                    { value: "tenis", label: "Tenis" },
                    { value: "beach-tenis", label: "Beach Tenis" },
                  ].map((sport) => (
                    <div key={sport.value} className="flex items-center space-x-2">
                      <Checkbox id={sport.value} name="tipo-esporte" value={sport.value} />
                      <Label htmlFor={sport.value} className="cursor-pointer">
                        {sport.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Quadra *</Label>
                  <Input id="nome" placeholder="Ex: Arena Central" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade-quadras">Quantas quadras você tem? *</Label>
                  <Input id="quantidade-quadras" type="number" placeholder="Digite a quantidade de quadras" min="1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome-proprietario">Nome Completo *</Label>
                  <Input id="nome-proprietario" placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF/CNPJ *</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva sua quadra, suas características e diferenciais..."
                  rows={4}
                />
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo *</Label>
                    <Input id="endereco" placeholder="Rua, número, bairro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input id="cidade" placeholder="Ex: São Paulo" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" placeholder="00000-000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ac">Acre</SelectItem>
                        <SelectItem value="al">Alagoas</SelectItem>
                        <SelectItem value="ap">Amapá</SelectItem>
                        <SelectItem value="am">Amazonas</SelectItem>
                        <SelectItem value="ba">Bahia</SelectItem>
                        <SelectItem value="ce">Ceará</SelectItem>
                        <SelectItem value="df">Distrito Federal</SelectItem>
                        <SelectItem value="es">Espírito Santo</SelectItem>
                        <SelectItem value="go">Goiás</SelectItem>
                        <SelectItem value="ma">Maranhão</SelectItem>
                        <SelectItem value="mt">Mato Grosso</SelectItem>
                        <SelectItem value="ms">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="mg">Minas Gerais</SelectItem>
                        <SelectItem value="pa">Pará</SelectItem>
                        <SelectItem value="pb">Paraíba</SelectItem>
                        <SelectItem value="pr">Paraná</SelectItem>
                        <SelectItem value="pe">Pernambuco</SelectItem>
                        <SelectItem value="pi">Piauí</SelectItem>
                        <SelectItem value="rj">Rio de Janeiro</SelectItem>
                        <SelectItem value="rn">Rio Grande do Norte</SelectItem>
                        <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                        <SelectItem value="ro">Rondônia</SelectItem>
                        <SelectItem value="rr">Roraima</SelectItem>
                        <SelectItem value="sc">Santa Catarina</SelectItem>
                        <SelectItem value="sp">São Paulo</SelectItem>
                        <SelectItem value="se">Sergipe</SelectItem>
                        <SelectItem value="to">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Preços e Horários */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preços e Horários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço por Hora (R$) *</Label>
                    <Input id="preco" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario-inicio">Horário de Abertura *</Label>
                    <Input id="horario-inicio" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario-fim">Horário de Fechamento *</Label>
                    <Input id="horario-fim" type="time" />
                  </div>
                </div>
              </div>

              {/* Comodidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Estacionamento",
                    "Vestiário",
                    "Chuveiro",
                    "Iluminação",
                    "Cobertura",
                    "Lanchonete",
                    "Wi-Fi",
                    "Segurança",
                    "Arquibancada",
                  ].map((comodidade) => (
                    <div key={comodidade} className="flex items-center space-x-2">
                      <Checkbox id={comodidade.toLowerCase()} />
                      <Label htmlFor={comodidade.toLowerCase()}>{comodidade}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload de Fotos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Fotos da Quadra
                </h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para fazer upload ou arraste as fotos aqui
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG até 10MB cada (máximo 10 fotos)</p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Selecionar Fotos
                  </Button>
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-center space-x-2">
                <Checkbox id="termos" />
                <Label htmlFor="termos" className="text-sm">
                  Aceito os{" "}
                  <Link href="#" className="text-primary hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link href="#" className="text-primary hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button className="flex-1">Cadastrar Quadra</Button>
                <Button variant="outline" onClick={() => setCurrentView("options")}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  if (currentView === "dashboard") return <DashboardView />
  if (currentView === "cadastro") return <CadastroView />
  if (currentView === "acesso") return <AcessoView />
  return <OptionsView />
}
