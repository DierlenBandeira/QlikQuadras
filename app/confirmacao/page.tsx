"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Clock, MapPin, Phone, MessageCircle, Download, Share, Home } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const courtData = {
  1: {
    name: "Natu Sport",
    location: "Vila Madalena, São Paulo",
    address: "Rua Harmonia, 123 - Vila Madalena, São Paulo - SP",
    sport: "Futebol",
    price: 120,
    image: "/placeholder.svg?height=100&width=100&text=Natu",
    phone: "(11) 99999-9999",
    owner: {
      name: "Carlos Silva",
      phone: "(11) 99999-9999",
    },
  },
}

export default function Confirmation() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const courtId = searchParams.get("courtId")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const total = searchParams.get("total")

  const [bookingId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase())

  const court = courtData[Number.parseInt(courtId || "1") as keyof typeof courtData]
  const bookingDate = date ? new Date(date) : new Date()
  const bookingTime = time || "14:00"

  const downloadReceipt = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Configurar tamanho do canvas
    canvas.width = 600
    canvas.height = 800

    // Fundo branco
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header com gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 100)
    gradient.addColorStop(0, "#00B300")
    gradient.addColorStop(1, "#003366")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, 100)

    // Logo/Título
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 28px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Clik Quadras", canvas.width / 2, 45)
    ctx.font = "16px Arial"
    ctx.fillText("Comprovante de Reserva", canvas.width / 2, 75)

    // Conteúdo principal
    ctx.fillStyle = "#000000"
    ctx.textAlign = "left"
    let y = 150

    // ID da reserva
    ctx.font = "bold 18px Arial"
    ctx.fillText(`Reserva #${bookingId}`, 50, y)
    y += 40

    // Dados da quadra
    ctx.font = "bold 16px Arial"
    ctx.fillText("Quadra:", 50, y)
    ctx.font = "16px Arial"
    ctx.fillText(court.name, 120, y)
    y += 30

    ctx.font = "bold 16px Arial"
    ctx.fillText("Local:", 50, y)
    ctx.font = "16px Arial"
    ctx.fillText(court.location, 100, y)
    y += 30

    ctx.font = "bold 16px Arial"
    ctx.fillText("Esporte:", 50, y)
    ctx.font = "16px Arial"
    ctx.fillText(court.sport, 120, y)
    y += 50

    // Data e horário
    ctx.font = "bold 16px Arial"
    ctx.fillText("Data:", 50, y)
    ctx.font = "16px Arial"
    ctx.fillText(
      bookingDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      100,
      y,
    )
    y += 30

    ctx.font = "bold 16px Arial"
    ctx.fillText("Horário:", 50, y)
    ctx.font = "16px Arial"
    ctx.fillText(
      `${bookingTime} - ${String(Number.parseInt(bookingTime.split(":")[0]) + 1).padStart(2, "0")}:00`,
      120,
      y,
    )
    y += 50

    // Valor
    ctx.font = "bold 18px Arial"
    ctx.fillText("Valor Total:", 50, y)
    ctx.fillStyle = "#00B300"
    ctx.fillText(`R$ ${total}`, 180, y)
    y += 60

    // Informações importantes
    ctx.fillStyle = "#000000"
    ctx.font = "bold 16px Arial"
    ctx.fillText("Informações Importantes:", 50, y)
    y += 30

    const instructions = [
      "• Chegue com 15 minutos de antecedência para check-in",
      "• Apresente este comprovante no dia da reserva",
      "• Traga documento de identificação com foto",
    ]

    instructions.forEach((instruction) => {
      ctx.fillText(instruction, 50, y)
      y += 25
    })

    // Contato
    y += 30
    ctx.font = "bold 16px Arial"
    ctx.fillText("Contato do Proprietário:", 50, y)
    y += 25
    ctx.font = "14px Arial"
    ctx.fillText(`${court.owner.name} - ${court.owner.phone}`, 50, y)

    // Footer
    y = canvas.height - 50
    ctx.font = "12px Arial"
    ctx.fillStyle = "#666666"
    ctx.textAlign = "center"
    ctx.fillText(`Gerado em ${new Date().toLocaleString("pt-BR")}`, canvas.width / 2, y)

    // Download
    const link = document.createElement("a")
    link.download = `comprovante-reserva-${bookingId}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  useEffect(() => {
    // Simular envio de confirmação por email/SMS
    console.log("Confirmação enviada para o usuário")
  }, [])

  if (!court) {
    return <div>Erro: Dados da reserva não encontrados</div>
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Reserva confirmada!</h1>
          <p className="text-muted-foreground">
            Sua quadra foi reservada com sucesso. Você receberá uma confirmação por email e SMS.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Detalhes da reserva</CardTitle>
              <Badge variant="secondary">#{bookingId}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Image
                src={court.image || "/placeholder.svg"}
                alt={court.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{court.name}</h3>
                <p className="text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {court.location}
                </p>
                <Badge className="mt-2">{court.sport}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingTime} - {String(Number.parseInt(bookingTime.split(":")[0]) + 1).padStart(2, "0")}:00
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total pago</span>
                <span className="text-xl font-bold text-primary-700">R$ {total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Contact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Localização e contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-1">Endereço</p>
              <p className="text-muted-foreground">{court.address}</p>
            </div>

            <div>
              <p className="font-medium mb-2">Contato do proprietário</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium">{court.owner.name}</p>
                  <p className="text-sm text-muted-foreground">{court.owner.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Informações importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                <span>Chegue com 15 minutos de antecedência para check-in e preparação</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                <span>Apresente este comprovante no dia da reserva</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                <span>Traga documento de identificação com foto (RG, CNH ou passaporte)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={downloadReceipt}>
              <Download className="h-4 w-4" />
              Baixar comprovante
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>

          <Link href="/" className="block">
            <Button className="w-full" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Precisa de ajuda com sua reserva?</p>
          <Button variant="link" className="text-primary">
            Entre em contato conosco
          </Button>
        </div>
      </div>
    </div>
  )
}
