"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

const courtData = {
  1: {
    name: "Natu Sport",
    location: "Vila Madalena, São Paulo",
    sport: "Futebol",
    price: 120,
    image: "/placeholder.svg?height=100&width=100&text=Natu",
  },
  2: {
    name: "Chute Certo",
    location: "Jardins, São Paulo",
    sport: "Vôlei",
    price: 200,
    image: "/placeholder.svg?height=100&width=100&text=Chute",
  },
  3: {
    name: "Centro Esportivo Elite",
    location: "Moema, São Paulo",
    sport: "Basquete",
    price: 150,
    image: "/placeholder.svg?height=100&width=100&text=Elite",
  },
  4: {
    name: "Beach Sports",
    location: "Vila Olímpia, São Paulo",
    sport: "Beach Tennis",
    price: 180,
    image: "/placeholder.svg?height=100&width=100&text=Beach",
  },
  5: {
    name: "Futsal Pro",
    location: "Pinheiros, São Paulo",
    sport: "Futsal",
    price: 100,
    image: "/placeholder.svg?height=100&width=100&text=Futsal",
  },
  6: {
    name: "Tennis Club Premium",
    location: "Itaim Bibi, São Paulo",
    sport: "Tênis",
    price: 250,
    image: "/placeholder.svg?height=100&width=100&text=Tennis",
  },
}

// Funções de validação
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.charAt(10))) return false

  return true
}

const validatePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, "")
  return cleanPhone.length === 10 || cleanPhone.length === 11
}

const validateCardNumber = (cardNumber: string) => {
  const cleanCard = cardNumber.replace(/\D/g, "")
  return cleanCard.length >= 13 && cleanCard.length <= 19
}

const validateExpiryDate = (expiryDate: string) => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
  if (!regex.test(expiryDate)) return false

  const [month, year] = expiryDate.split("/")
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const expYear = Number.parseInt(year)
  const expMonth = Number.parseInt(month)

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false
  }

  return true
}

const validateCVV = (cvv: string) => {
  const cleanCVV = cvv.replace(/\D/g, "")
  return cleanCVV.length === 3 || cleanCVV.length === 4
}

// Funções de formatação
const formatCPF = (value: string) => {
  const cleanValue = value.replace(/\D/g, "")
  return cleanValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

const formatPhone = (value: string) => {
  const cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

const formatCardNumber = (value: string) => {
  const cleanValue = value.replace(/\D/g, "")
  return cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ")
}

const formatExpiryDate = (value: string) => {
  const cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length >= 2) {
    return cleanValue.replace(/(\d{2})(\d{0,2})/, "$1/$2")
  }
  return cleanValue
}

export default function Checkout() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const courtId = searchParams.get("courtId")
  const parsedCourtId = Number.parseInt(courtId || "1")
  const court = courtData[parsedCourtId as keyof typeof courtData] || courtData[1]

  const date = searchParams.get("date")
  const time = searchParams.get("time")

  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    installments: "1",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptCancellationPolicy, setAcceptCancellationPolicy] = useState(false)

  const bookingDate = date ? new Date(date) : new Date()
  const bookingTime = time || "14:00"

  const serviceFee = 8.5
  const total = court.price + serviceFee

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    // Aplicar formatação
    switch (field) {
      case "cpf":
        formattedValue = formatCPF(value)
        break
      case "phone":
        formattedValue = formatPhone(value)
        break
      case "cardNumber":
        formattedValue = formatCardNumber(value)
        break
      case "expiryDate":
        formattedValue = formatExpiryDate(value)
        break
      case "cvv":
        formattedValue = value.replace(/\D/g, "").slice(0, 4)
        break
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validações básicas
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Telefone inválido"
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }

    // Validações de pagamento (apenas para cartão)
    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Número do cartão é obrigatório"
      } else if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = "Número do cartão inválido"
      }

      if (!formData.cardName.trim()) {
        newErrors.cardName = "Nome no cartão é obrigatório"
      } else if (formData.cardName.trim().length < 2) {
        newErrors.cardName = "Nome no cartão deve ter pelo menos 2 caracteres"
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Data de validade é obrigatória"
      } else if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = "Data de validade inválida ou expirada"
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV é obrigatório"
      } else if (!validateCVV(formData.cvv)) {
        newErrors.cvv = "CVV inválido"
      }
    }

    if (!acceptTerms) {
      newErrors.terms = "Você deve aceitar os termos e condições"
    }

    if (!acceptCancellationPolicy) {
      newErrors.cancellationPolicy = "Você deve aceitar a Política de Cancelamento e Reembolso"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsProcessing(true)

    // Simular processamento do pagamento
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Redirecionar para confirmação
    router.push(`/confirmacao?courtId=${courtId}&date=${date}&time=${time}&total=${total}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Finalizar reserva</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Booking Summary */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary-600" />
              Resumo da reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative">
                <Image
                  src={court.image || "/placeholder.svg"}
                  alt={court.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{court.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {court.location}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {bookingDate.toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {bookingTime} - {String(Number.parseInt(bookingTime.split(":")[0]) + 1).padStart(2, "0")}:00
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Seus dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                  className={errors.name ? "border-destructive focus:border-destructive" : ""}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className={errors.email ? "border-destructive focus:border-destructive" : ""}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.phone ? "border-destructive focus:border-destructive" : ""}
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? "border-destructive focus:border-destructive" : ""}
                />
                {errors.cpf && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.cpf}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Forma de pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="credit" id="credit" />
                <CreditCard className="h-5 w-5" />
                <Label htmlFor="credit" className="flex-1 cursor-pointer">
                  Cartão de Crédito
                </Label>
                <Badge variant="secondary" className="text-xs">
                  Parcelamento
                </Badge>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="debit" id="debit" />
                <CreditCard className="h-5 w-5" />
                <Label htmlFor="debit" className="flex-1 cursor-pointer">
                  Cartão de Débito
                </Label>
                <Badge variant="secondary" className="text-xs">
                  À vista
                </Badge>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="pix" id="pix" />
                <Smartphone className="h-5 w-5" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">
                  PIX
                </Label>
                <Badge className="text-xs bg-primary-100 text-primary-700">5% desconto</Badge>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="on-site" id="on-site" />
                <MapPin className="h-5 w-5" />
                <Label htmlFor="on-site" className="flex-1 cursor-pointer">
                  Pagar na Quadra
                </Label>
                <Badge variant="outline" className="text-xs">
                  Aprovação necessária
                </Badge>
              </div>
            </RadioGroup>

            {(paymentMethod === "credit" || paymentMethod === "debit") && (
              <div className="mt-6 space-y-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label htmlFor="cardNumber">Número do cartão *</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className={errors.cardNumber ? "border-destructive focus:border-destructive" : ""}
                  />
                  {errors.cardNumber && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cardNumber}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="cardName">Nome no cartão *</Label>
                  <Input
                    id="cardName"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    className={errors.cardName ? "border-destructive focus:border-destructive" : ""}
                  />
                  {errors.cardName && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cardName}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Validade *</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      placeholder="MM/AA"
                      className={errors.expiryDate ? "border-destructive focus:border-destructive" : ""}
                    />
                    {errors.expiryDate && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.expiryDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      placeholder="123"
                      className={errors.cvv ? "border-destructive focus:border-destructive" : ""}
                    />
                    {errors.cvv && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.cvv}
                      </div>
                    )}
                  </div>
                </div>
                {paymentMethod === "credit" && (
                  <div>
                    <Label htmlFor="installments">Parcelas</Label>
                    <select
                      id="installments"
                      value={formData.installments}
                      onChange={(e) => handleInputChange("installments", e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="1">1x de R$ {total.toFixed(2)} sem juros</option>
                      <option value="2">2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                      <option value="3">3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                      <option value="6">6x de R$ {((total * 1.05) / 6).toFixed(2)} com juros</option>
                      <option value="12">12x de R$ {((total * 1.15) / 12).toFixed(2)} com juros</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "pix" && (
              <Alert className="mt-6 border-primary-200 bg-primary-50">
                <Shield className="h-4 w-4 text-primary-600" />
                <AlertDescription className="text-primary-700">
                  <strong>5% de desconto!</strong> Após confirmar, você receberá o código PIX para pagamento. Total com
                  desconto: <strong>R$ {(total * 0.95).toFixed(2)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "on-site" && (
              <Alert className="mt-6 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  <strong>Atenção!</strong> Sua reserva ficará pendente até que o proprietário aprove o pagamento
                  presencial. Você receberá uma confirmação por e-mail assim que aprovada.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card className="shadow-lg border-0 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Política de Cancelamento e Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg text-sm leading-relaxed space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  O presente instrumento tem por finalidade estabelecer as condições para cancelamento e reembolso das
                  reservas realizadas por meio deste aplicativo, observando-se a legislação brasileira aplicável,
                  especialmente o Código Civil (Lei nº 10.406/2002) e o Código de Defesa do Consumidor – CDC (Lei nº
                  8.078/1990).
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">1. Condições Gerais</h4>
                <p>
                  Ao confirmar a reserva, o usuário celebra um contrato de prestação de serviços com o estabelecimento
                  esportivo escolhido, sendo o aplicativo mero intermediador da transação. As regras aqui dispostas
                  visam resguardar a disponibilidade de agenda e compensar eventuais prejuízos decorrentes de
                  cancelamentos de última hora, nos termos do art. 421 do Código Civil, que consagra a liberdade
                  contratual, e do art. 6º, inciso III, do CDC, que garante o direito à informação prévia e clara.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Prazos e Percentuais de Reembolso</h4>

                <div className="ml-4 space-y-3">
                  <div>
                    <h5 className="font-medium">
                      2.1. Cancelamento com antecedência igual ou superior a 24 (vinte e quatro) horas
                    </h5>
                    <p>
                      O usuário que cancelar a reserva com antecedência igual ou superior a 24 (vinte e quatro) horas da
                      data e horário agendados fará jus ao reembolso integral, correspondente a 100% (cem por cento) do
                      valor pago.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium">
                      2.2. Cancelamento com antecedência entre 12 (doze) e 24 (vinte e quatro) horas
                    </h5>
                    <p>
                      O cancelamento efetuado com antecedência mínima de 12 (doze) horas e inferior a 24 (vinte e
                      quatro) horas da data e horário agendados dará direito ao reembolso correspondente a 75% (setenta
                      e cinco por cento) do valor pago.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium">2.3. Cancelamento com antecedência inferior a 12 (doze) horas</h5>
                    <p>
                      O cancelamento efetuado com antecedência inferior a 12 (doze) horas da data e horário agendados
                      dará direito ao reembolso correspondente a 50% (cinquenta por cento) do valor pago.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Justificativa Legal</h4>
                <p>
                  As condições acima encontram respaldo no art. 393 do Código Civil, que dispõe sobre a responsabilidade
                  das partes por descumprimento contratual, e no art. 20 do CDC, que autoriza a retenção proporcional de
                  valores quando houver despesas operacionais ou perda de oportunidade de venda do serviço.
                </p>
                <p className="mt-2">
                  Tais percentuais têm por objetivo compensar o prestador de serviço pela indisponibilidade gerada e
                  custos administrativos incorridos, sem que haja enriquecimento ilícito, em observância ao art. 884 do
                  Código Civil.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Forma e Prazo de Reembolso</h4>
                <p>
                  O reembolso será processado pelo mesmo meio de pagamento utilizado na reserva, no prazo de até 7
                  (sete) dias úteis, contados da solicitação aprovada, observadas as regras e prazos da operadora de
                  pagamento ou instituição financeira responsável.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. Concordância</h4>
                <p>
                  Ao prosseguir com a reserva no aplicativo, o usuário declara ter lido, compreendido e aceitado
                  integralmente as presentes condições, reconhecendo que tais regras foram disponibilizadas previamente,
                  em atendimento ao art. 46 do Código de Defesa do Consumidor.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-4 border-t">
              <Checkbox
                id="cancellationPolicy"
                checked={acceptCancellationPolicy}
                onCheckedChange={setAcceptCancellationPolicy}
              />
              <Label htmlFor="cancellationPolicy" className="text-sm leading-relaxed cursor-pointer font-medium">
                Li e concordo com a Política de Cancelamento e Reembolso
              </Label>
            </div>
            {errors.cancellationPolicy && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.cancellationPolicy}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Aluguel da quadra (1 hora)</span>
                <span>R$ {court.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de serviço</span>
                <span>R$ {serviceFee.toFixed(2)}</span>
              </div>
              {paymentMethod === "pix" && (
                <div className="flex justify-between text-primary-600">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {(total * 0.05).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R$ {paymentMethod === "pix" ? (total * 0.95).toFixed(2) : total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Concordo com os <span className="text-primary underline">termos e condições</span> gerais do aplicativo
            </Label>
          </div>
          {errors.terms && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.terms}
            </div>
          )}
        </div>

        {/* Payment Button */}
        <Button
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processando pagamento...
            </div>
          ) : (
            `Pagar R$ ${paymentMethod === "pix" ? (total * 0.95).toFixed(2) : total.toFixed(2)}`
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Pagamento 100% seguro e criptografado</span>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-6" />
    </div>
  )
}
