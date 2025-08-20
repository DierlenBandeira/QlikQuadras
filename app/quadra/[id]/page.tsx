"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  Heart,
  MapPin,
  Shield,
  Camera,
  Share,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Map,
  Navigation,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const courtDetails = {
  1: {
    id: 1,
    name: "Natu Sport",
    location: "Vila Madalena, São Paulo",
    address: "Rua Harmonia, 123 - Vila Madalena, São Paulo - SP",
    price: 120,
    rating: 4.8,
    reviewCount: 3,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2821%29-HwkXEU474l5Vc0nLjzSFaMrs5PezRg.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2823%29-awGfFkUoW8VGtMpWWDekbkNCqyzl5t.png",
      "/placeholder.svg?height=400&width=600&text=Quadra+2",
      "/placeholder.svg?height=400&width=600&text=Quadra+3",
    ],
    amenities: [
      "Vestiário masculino e feminino",
      "Chuveiros com água quente",
      "Estacionamento gratuito",
      "Iluminação LED",
      "Grama sintética de qualidade",
      "Arquibancada para 50 pessoas",
    ],
    description:
      "Quadra de futebol society com excelente infraestrutura localizada no coração da Vila Madalena. Ideal para peladas com os amigos ou treinos profissionais.",
    owner: {
      name: "Carlos Silva",
      phone: "(11) 99999-9999",
      whatsapp: "5511999999999",
    },
    availableHours: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
    ],
    reviews: [
      {
        id: 1,
        user: "João Silva",
        avatar: "/placeholder.svg?height=40&width=40&text=JS",
        rating: 5,
        date: "2024-01-15",
        comment: "Excelente quadra! Muito bem cuidada e com ótima infraestrutura. O Carlos é super atencioso.",
      },
      {
        id: 2,
        user: "Maria Santos",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
        rating: 4,
        date: "2024-01-10",
        comment: "Boa localização e fácil acesso. Vestiários limpos e organizados. Recomendo!",
      },
      {
        id: 3,
        user: "Pedro Costa",
        avatar: "/placeholder.svg?height=40&width=40&text=PC",
        rating: 5,
        date: "2024-01-08",
        comment: "Melhor quadra da região! Grama sintética de qualidade e iluminação perfeita para jogos noturnos.",
      },
    ],
  },
  2: {
    id: 2,
    name: "Chute Certo",
    location: "Ibirapuera, São Paulo",
    address: "Av. Paulista, 456 - Ibirapuera, São Paulo - SP",
    price: 200,
    rating: 4.7,
    reviewCount: 3,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2822%29-lFOqlADWsXMuMkQS60qzHUnHkHEpSi.png",
      "/placeholder.svg?height=400&width=600&text=Quadra+2",
      "/placeholder.svg?height=400&width=600&text=Quadra+3",
    ],
    amenities: [
      "Vestiário masculino e feminino",
      "Chuveiros com água quente",
      "Estacionamento pago",
      "Iluminação LED profissional",
      "Grama sintética premium",
      "Arquibancada para 80 pessoas",
      "Lanchonete no local",
    ],
    description:
      "Quadra de futebol society premium com infraestrutura de alto padrão no Ibirapuera. Perfeita para jogos profissionais e eventos corporativos.",
    owner: {
      name: "Ana Costa",
      phone: "(11) 88888-8888",
      whatsapp: "5511888888888",
    },
    availableHours: [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    reviews: [
      {
        id: 1,
        user: "Roberto Lima",
        avatar: "/placeholder.svg?height=40&width=40&text=RL",
        rating: 5,
        date: "2024-01-12",
        comment: "Quadra excelente! Piso muito bom e iluminação perfeita. A Ana é muito atenciosa.",
      },
      {
        id: 2,
        user: "Carla Mendes",
        avatar: "/placeholder.svg?height=40&width=40&text=CM",
        rating: 4,
        date: "2024-01-08",
        comment: "Ótima localização e fácil acesso. Vestiários limpos e organizados.",
      },
      {
        id: 3,
        user: "Felipe Santos",
        avatar: "/placeholder.svg?height=40&width=40&text=FS",
        rating: 5,
        date: "2024-01-05",
        comment: "Melhor quadra de vôlei da região! Rede na altura certa e piso antiderrapante.",
      },
    ],
  },
  3: {
    id: 3,
    name: "Centro Esportivo Elite",
    location: "Pinheiros, São Paulo",
    address: "Rua dos Pinheiros, 789 - Pinheiros, São Paulo - SP",
    price: 100,
    rating: 4.9,
    reviewCount: 4,
    images: [
      "/indoor-basketball-arena.png",
      "/placeholder.svg?height=400&width=600&text=Quadra+Basquete+2",
      "/placeholder.svg?height=400&width=600&text=Vestiario+Elite",
      "/placeholder.svg?height=400&width=600&text=Arquibancada",
    ],
    amenities: [
      "Ar condicionado central",
      "Vestiário masculino e feminino premium",
      "Estacionamento coberto gratuito",
      "Iluminação LED profissional",
      "Piso oficial de basquete",
      "Arquibancada para 200 pessoas",
      "Sistema de som profissional",
      "Segurança 24h",
    ],
    description:
      "Centro esportivo de alto padrão especializado em basquete, com infraestrutura profissional e localização privilegiada em Pinheiros. Ideal para treinos, jogos e eventos corporativos.",
    owner: {
      name: "Ricardo Oliveira",
      phone: "(11) 77777-7777",
      whatsapp: "5511777777777",
    },
    availableHours: [
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    reviews: [
      {
        id: 1,
        user: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
        rating: 5,
        date: "2024-01-18",
        comment:
          "Quadra profissional de verdade! Piso perfeito e ar condicionado excelente. Ricardo é muito profissional.",
      },
      {
        id: 2,
        user: "Fernanda Lima",
        avatar: "/placeholder.svg?height=40&width=40&text=FL",
        rating: 5,
        date: "2024-01-14",
        comment: "Melhor quadra de basquete da região! Infraestrutura impecável e localização ótima.",
      },
      {
        id: 3,
        user: "Diego Santos",
        avatar: "/placeholder.svg?height=40&width=40&text=DS",
        rating: 4,
        date: "2024-01-11",
        comment: "Excelente para treinos. Vestiários limpos e estacionamento seguro.",
      },
      {
        id: 4,
        user: "Camila Rocha",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
        rating: 5,
        date: "2024-01-07",
        comment: "Quadra top! Sistema de som muito bom para eventos. Recomendo demais!",
      },
    ],
  },
  4: {
    id: 4,
    name: "Beach Sports",
    location: "Santos, SP",
    address: "Av. Atlântica, 321 - Gonzaga, Santos - SP",
    price: 150,
    rating: 4.7,
    reviewCount: 5,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beach-tennis-xcropygbV2cjvsHRe3TXQB8y2qdDXc.webp",
      "/placeholder.svg?height=400&width=600&text=Vista+Mar",
      "/placeholder.svg?height=400&width=600&text=Bar+Beach",
      "/placeholder.svg?height=400&width=600&text=Equipamentos",
    ],
    amenities: [
      "Vista panorâmica para o mar",
      "Chuveiros com água doce",
      "Bar e lanchonete",
      "Aluguel de equipamentos",
      "Areia de qualidade premium",
      "Redes oficiais de beach tennis",
      "Guarda-volumes",
      "Estacionamento próximo",
    ],
    description:
      "Complexo de beach tennis com vista deslumbrante para o mar em Santos. Areia de qualidade premium e infraestrutura completa para a prática do esporte na praia.",
    owner: {
      name: "Marina Souza",
      phone: "(13) 66666-6666",
      whatsapp: "5513666666666",
    },
    availableHours: ["07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
    reviews: [
      {
        id: 1,
        user: "Bruno Martins",
        avatar: "/placeholder.svg?height=40&width=40&text=BM",
        rating: 5,
        date: "2024-01-20",
        comment: "Vista incrível! Areia de qualidade e a Marina é super atenciosa. Melhor beach tennis da baixada!",
      },
      {
        id: 2,
        user: "Juliana Costa",
        avatar: "/placeholder.svg?height=40&width=40&text=JC",
        rating: 4,
        date: "2024-01-16",
        comment: "Lugar maravilhoso para jogar beach tennis. Bar com ótimas opções e vista linda.",
      },
      {
        id: 3,
        user: "Rafael Pereira",
        avatar: "/placeholder.svg?height=40&width=40&text=RP",
        rating: 5,
        date: "2024-01-13",
        comment: "Areia perfeita e redes na altura certa. Equipamentos de aluguel em ótimo estado.",
      },
      {
        id: 4,
        user: "Larissa Alves",
        avatar: "/placeholder.svg?height=40&width=40&text=LA",
        rating: 4,
        date: "2024-01-09",
        comment: "Experiência única jogando com vista para o mar. Chuveiros limpos e funcionais.",
      },
      {
        id: 5,
        user: "Thiago Ribeiro",
        avatar: "/placeholder.svg?height=40&width=40&text=TR",
        rating: 5,
        date: "2024-01-05",
        comment: "Melhor lugar para beach tennis em Santos! Ambiente descontraído e profissional.",
      },
    ],
  },
  5: {
    id: 5,
    name: "Futsal Pro",
    location: "Moema, São Paulo",
    address: "Rua Moema, 456 - Moema, São Paulo - SP",
    price: 90,
    rating: 4.5,
    reviewCount: 3,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2821%29-HwkXEU474l5Vc0nLjzSFaMrs5PezRg.png",
      "/placeholder.svg?height=400&width=600&text=Futsal+2",
      "/placeholder.svg?height=400&width=600&text=Som+Ambiente",
      "/placeholder.svg?height=400&width=600&text=Vestiario+Futsal",
    ],
    amenities: [
      "Vestiário masculino e feminino",
      "Chuveiros com água quente",
      "Iluminação LED de alta qualidade",
      "Som ambiente profissional",
      "Piso oficial de futsal",
      "Placar eletrônico",
      "Bebedouros",
      "Estacionamento na rua",
    ],
    description:
      "Quadra de futsal moderna em Moema com excelente custo-benefício. Piso oficial e som ambiente para uma experiência completa de jogo.",
    owner: {
      name: "Paulo Henrique",
      phone: "(11) 55555-5555",
      whatsapp: "5511555555555",
    },
    availableHours: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    reviews: [
      {
        id: 1,
        user: "Anderson Silva",
        avatar: "/placeholder.svg?height=40&width=40&text=AS",
        rating: 5,
        date: "2024-01-17",
        comment: "Ótimo custo-benefício! Quadra bem cuidada e o Paulo é muito gente boa. Som ambiente top!",
      },
      {
        id: 2,
        user: "Cristiane Moura",
        avatar: "/placeholder.svg?height=40&width=40&text=CM",
        rating: 4,
        date: "2024-01-12",
        comment: "Quadra boa para futsal. Piso em bom estado e vestiários limpos. Localização excelente.",
      },
      {
        id: 3,
        user: "Gustavo Reis",
        avatar: "/placeholder.svg?height=40&width=40&text=GR",
        rating: 4,
        date: "2024-01-08",
        comment: "Preço justo e qualidade boa. Iluminação adequada para jogos noturnos.",
      },
    ],
  },
  6: {
    id: 6,
    name: "Tennis Club Premium",
    location: "Jardins, São Paulo",
    address: "Rua Augusta, 987 - Jardins, São Paulo - SP",
    price: 200,
    rating: 4.9,
    reviewCount: 6,
    images: [
      "/indoor-volleyball-court.png",
      "/placeholder.svg?height=400&width=600&text=Saibro+Premium",
      "/placeholder.svg?height=400&width=600&text=Lanchonete+Club",
      "/placeholder.svg?height=400&width=600&text=Vestiario+Premium",
    ],
    amenities: [
      "Quadra de saibro profissional",
      "Vestiário premium com amenities",
      "Estacionamento com valet",
      "Lanchonete gourmet",
      "Aluguel de raquetes premium",
      "Iluminação profissional",
      "Ar condicionado no vestiário",
      "Serviço de toalhas",
    ],
    description:
      "Club de tênis premium nos Jardins com quadra de saibro profissional e serviços de alto padrão. Experiência exclusiva para amantes do tênis.",
    owner: {
      name: "Eduardo Martins",
      phone: "(11) 44444-4444",
      whatsapp: "5511444444444",
    },
    availableHours: [
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ],
    reviews: [
      {
        id: 1,
        user: "Patricia Almeida",
        avatar: "/placeholder.svg?height=40&width=40&text=PA",
        rating: 5,
        date: "2024-01-19",
        comment:
          "Experiência premium de verdade! Saibro perfeito e atendimento impecável. Eduardo é muito profissional.",
      },
      {
        id: 2,
        user: "Roberto Farias",
        avatar: "/placeholder.svg?height=40&width=40&text=RF",
        rating: 5,
        date: "2024-01-15",
        comment: "Melhor club de tênis de SP! Vestiários luxuosos e lanchonete excelente.",
      },
      {
        id: 3,
        user: "Isabela Santos",
        avatar: "/placeholder.svg?height=40&width=40&text=IS",
        rating: 4,
        date: "2024-01-11",
        comment: "Quadra profissional e localização privilegiada. Vale cada centavo!",
      },
      {
        id: 4,
        user: "Marcelo Costa",
        avatar: "/placeholder.svg?height=40&width=40&text=MC",
        rating: 5,
        date: "2024-01-08",
        comment: "Saibro de qualidade internacional. Raquetes de aluguel são top de linha.",
      },
      {
        id: 5,
        user: "Vanessa Lima",
        avatar: "/placeholder.svg?height=40&width=40&text=VL",
        rating: 5,
        date: "2024-01-04",
        comment: "Atendimento VIP! Estacionamento com valet é um diferencial. Recomendo!",
      },
      {
        id: 6,
        user: "Alexandre Rocha",
        avatar: "/placeholder.svg?height=40&width=40&text=AR",
        rating: 4,
        date: "2024-01-01",
        comment: "Club premium com toda infraestrutura necessária. Experiência única em SP.",
      },
    ],
  },
}

const occupiedSlots = {
  "2024-12-15": ["09:00", "14:00", "18:00"],
  "2024-12-16": ["10:00", "15:00"],
  "2024-12-17": ["08:00", "16:00", "19:00"],
}

const isTimeOccupied = (date: Date | undefined, time: string) => {
  if (!date) return false
  const dateKey = date.toISOString().split("T")[0]
  return occupiedSlots[dateKey]?.includes(time) || false
}

export default function CourtDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courtId = Number.parseInt(params.id)
  const court = courtDetails[courtId as keyof typeof courtDetails]

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)
  const [showBookingCard, setShowBookingCard] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const unavailableDates = [
    new Date(2024, 11, 20), // December 20, 2024
    new Date(2024, 11, 25), // December 25, 2024
    new Date(2024, 11, 31), // December 31, 2024
    new Date(2025, 0, 1), // January 1, 2025
    new Date(2025, 0, 15), // January 15, 2025
  ]

  const isDateUnavailable = (date: Date) => {
    if (!date) return false
    return unavailableDates.some(
      (unavailableDate) =>
        date.getDate() === unavailableDate.getDate() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getFullYear() === unavailableDate.getFullYear(),
    )
  }

  if (!court) {
    return <div>Quadra não encontrada</div>
  }

  const handleReserve = () => {
    if (selectedDate && selectedTime) {
      router.push(`/checkout?courtId=${courtId}&date=${selectedDate.toISOString()}&time=${selectedTime}`)
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % court.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + court.images.length) % court.images.length)
  }

  const selectedHour = court.availableHours.find((h) => h === selectedTime)
  const totalPrice = selectedHour ? 100 : court.price

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary-500 text-primary-500" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Images Gallery */}
        <div className="relative">
          {/* Mobile Gallery - Carousel */}
          <div className="md:hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={court.images[selectedImage] || "/placeholder.svg"}
                alt={court.name}
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {court.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full ${selectedImage === index ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Gallery - Grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-2 h-96">
              <div className="col-span-2 row-span-2 relative rounded-l-lg overflow-hidden">
                <Image
                  src={court.images[0] || "/placeholder.svg"}
                  alt={court.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setShowAllImages(true)}
                />
              </div>
              {court.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Foto ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setShowAllImages(true)}
                  />
                  {index === 3 && court.images.length > 5 && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
                      onClick={() => setShowAllImages(true)}
                    >
                      <span className="text-white font-semibold">+{court.images.length - 5} fotos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="default"
              className="absolute bottom-4 right-4 btn-primary rounded-xl shadow-lg"
              onClick={() => setShowAllImages(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Ver todas as fotos
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-3 lg:gap-8 lg:px-6">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8 animate-fade-in">
            {/* Title and Basic Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold mb-2 lg:text-3xl">{court.name}</h1>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{court.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Futebol
                </Badge>
              </div>
            </div>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 lg:h-16 lg:w-16">
                    <AvatarFallback className="text-sm lg:text-lg">
                      {court.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 lg:text-lg">{court.owner.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 lg:text-sm">Anfitrião desde 2020</p>
                    <div className="flex flex-col gap-1 text-xs mb-2 lg:flex-row lg:items-center lg:gap-4 lg:text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                        <span className="text-muted-foreground">(89)</span>
                      </div>
                      <span className="text-muted-foreground">Responde em 1 hora</span>
                    </div>
                    <p className="text-xs text-muted-foreground lg:text-sm">
                      Apaixonado por esportes, administro esta quadra há mais de 5 anos. Sempre busco proporcionar a
                      melhor experiência para nossos clientes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="about" className="text-xs py-2 lg:text-sm">
                  Sobre
                </TabsTrigger>
                <TabsTrigger value="amenities" className="text-xs py-2 lg:text-sm">
                  Comodidades
                </TabsTrigger>
                <TabsTrigger value="location" className="text-xs py-2 lg:text-sm">
                  Localização
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs py-2 lg:text-sm">
                  Avaliações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4 mt-4 lg:space-y-6 lg:mt-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3 lg:text-xl lg:mb-4">Sobre a quadra</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed lg:text-base">{court.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 lg:text-lg lg:mb-4">Regras da quadra</h3>
                  <div className="space-y-2 lg:grid lg:gap-3">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Uso de chuteiras apropriadas obrigatório</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Máximo 22 jogadores por horário</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Proibido fumar nas dependências</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Respeitar horários de início e fim</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Não é permitido consumo de bebidas alcoólicas</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">Crianças devem estar acompanhadas de responsáveis</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-4 lg:mt-6">
                <div className="space-y-3 lg:grid lg:gap-4">
                  {court.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Shield className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold mb-1 text-sm lg:text-base">{amenity}</h4>
                        <p className="text-xs text-muted-foreground">Descrição da comodidade</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                    <p className="text-muted-foreground">{court.address}</p>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Mapa interativo</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Navigation className="h-4 w-4 mr-2" />
                    Abrir no Google Maps
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{court.rating}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      <p className="font-semibold">{court.reviewCount} avaliações</p>
                      <p className="text-sm">Baseado em experiências reais</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {court.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{review.user}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar - Desktop */}
          <div className="hidden lg:block animate-fade-in">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">R$ {totalPrice}</span>
                    <span className="text-muted-foreground">/hora</span>
                  </div>
                  <Badge variant="secondary">Disponível</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Selecione a data</label>
                    <div className="border border-gray-200 rounded-xl p-2 bg-white">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="w-full"
                        fixedWeeks={true}
                        showOutsideDays={false}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Horários disponíveis</label>
                    <div className="grid grid-cols-2 gap-2">
                      {court.availableHours.map((hour) => {
                        const isOccupied = isTimeOccupied(selectedDate, hour)
                        return (
                          <Button
                            key={hour}
                            variant={selectedTime === hour ? "default" : "outline"}
                            size="sm"
                            onClick={() => !isOccupied && setSelectedTime(hour)}
                            disabled={isOccupied}
                            className={`h-auto py-2 px-3 flex flex-col gap-1 ${
                              isOccupied
                                ? "bg-red-100 border-red-300 text-red-600 cursor-not-allowed hover:bg-red-100"
                                : ""
                            }`}
                          >
                            <span className="text-sm font-medium">{hour}</span>
                            {isOccupied && <span className="text-xs">Ocupado</span>}
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
                        <span className="font-medium">
                          {selectedTime} - {String(Number.parseInt(selectedTime.split(":")[0]) + 1).padStart(2, "0")}:00
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R$ {totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleReserve}
                  >
                    {selectedDate && selectedTime ? "Reservar agora" : "Selecione data e horário"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Booking Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 safe-area-pb">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="font-bold">R$ {totalPrice}/hora</div>
            {selectedDate && selectedTime && (
              <div className="text-xs text-muted-foreground">
                {selectedDate.toLocaleDateString("pt-BR")} às {selectedTime}
              </div>
            )}
          </div>
          <Button onClick={() => setShowBookingCard(true)} className="px-6">
            Reservar
          </Button>
        </div>
      </div>

      {/* Mobile Booking Sheet */}
      <Dialog open={showBookingCard} onOpenChange={setShowBookingCard}>
        <DialogContent className="max-w-sm p-0 gap-0 max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Reservar quadra</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowBookingCard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Selecione a data</label>
                <div className="border border-gray-200 rounded-xl p-2 bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="w-full"
                    fixedWeeks={true}
                    showOutsideDays={false}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Horários disponíveis</label>
                <div className="grid grid-cols-2 gap-2">
                  {court.availableHours.map((hour) => {
                    const isOccupied = isTimeOccupied(selectedDate, hour)
                    return (
                      <Button
                        key={hour}
                        variant={selectedTime === hour ? "default" : "outline"}
                        size="sm"
                        onClick={() => !isOccupied && setSelectedTime(hour)}
                        disabled={isOccupied}
                        className={`h-auto py-3 px-2 flex flex-col gap-1 ${
                          isOccupied ? "bg-red-100 border-red-300 text-red-600 cursor-not-allowed hover:bg-red-100" : ""
                        }`}
                      >
                        <span className="text-sm font-medium">{hour}</span>
                        {isOccupied && <span className="text-xs">Ocupado</span>}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-muted/20 flex-shrink-0">
            {selectedDate && selectedTime && (
              <div className="p-3 bg-background rounded-lg mb-3 border">
                <div className="flex justify-between text-sm mb-1">
                  <span>Data:</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Horário:</span>
                  <span className="font-medium">
                    {selectedTime} - {String(Number.parseInt(selectedTime.split(":")[0]) + 1).padStart(2, "0")}:00
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>R$ {totalPrice}</span>
                </div>
              </div>
            )}

            <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleReserve} size="lg">
              {selectedDate && selectedTime ? "Continuar para pagamento" : "Selecione data e horário"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* All Images Dialog */}
      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas as fotos</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAllImages(false)}>
              <X className="h-4 w-4" />
            </Button>
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

      {/* Bottom padding for mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
