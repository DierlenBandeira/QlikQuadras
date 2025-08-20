"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Menu,
  MapPin,
  Star,
  Heart,
  Filter,
  CalendarIcon,
  Clock,
  Users,
  Wifi,
  Car,
  Zap,
  Droplets,
  Shield,
  Camera,
  Sparkles,
  Award,
  User,
  Settings,
  LogOut,
  Building2,
} from "lucide-react"

const sportCategories = [
  { id: "futebol", name: "Futebol", icon: "⚽" },
  { id: "volei", name: "Vôlei", icon: "🏐" },
  { id: "basquete", name: "Basquete", icon: "🏀" },
  { id: "tenis", name: "Tênis", icon: "🎾" },
  { id: "futsal", name: "Futsal", icon: "⚽" },
  { id: "beach", name: "Beach", icon: "🏖️" },
]

const heroImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2821%29-HwkXEU474l5Vc0nLjzSFaMrs5PezRg.png",
    alt: "Bola de futebol Nike em grama sintética em arena esportiva coberta",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem.jpg-rGwJdEQjTplMX0w7Afzl7icQWAQF27.jpeg",
    alt: "Jogadores em quadra indoor de futebol com grama sintética",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beach-tennis-xcropygbV2cjvsHRe3TXQB8y2qdDXc.webp",
    alt: "Raquetes coloridas de beach tennis na areia com jogadores ao fundo",
  },
  {
    src: "/indoor-volleyball-court.png",
    alt: "Quadra de vôlei indoor com iluminação profissional",
  },
  {
    src: "/indoor-basketball-arena.png",
    alt: "Quadra de basquete indoor com arquibancadas",
  },
]

const courts = [
  {
    id: 1,
    name: "Natu Sport",
    location: "Vila Madalena, São Paulo",
    sport: "Futebol",
    price: 120,
    rating: 4.8,
    reviews: 124,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem.jpg-rGwJdEQjTplMX0w7Afzl7icQWAQF27.jpeg",
    amenities: ["Vestiário", "Estacionamento", "Iluminação", "Chuveiro"],
    available: true,
    distance: "2.1 km",
    featured: true,
    premium: true,
  },
  {
    id: 2,
    name: "Chute Certo",
    location: "Ibirapuera, São Paulo",
    sport: "Vôlei",
    price: 200,
    rating: 4.6,
    reviews: 89,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2822%29-lFOqlADWsXMuMkQS60qzHUnHkHEpSi.png",
    amenities: ["Vestiário", "Iluminação", "Rede oficial"],
    available: true,
    distance: "1.5 km",
    featured: false,
    premium: false,
  },
  {
    id: 3,
    name: "Centro Esportivo Elite",
    location: "Pinheiros, São Paulo",
    sport: "Basquete",
    price: 100,
    rating: 4.9,
    reviews: 156,
    image: "/indoor-basketball-arena.png",
    amenities: ["Ar condicionado", "Vestiário", "Estacionamento", "Segurança"],
    available: false,
    distance: "3.2 km",
    featured: true,
    premium: true,
  },
  {
    id: 4,
    name: "Beach Sports",
    location: "Santos, SP",
    sport: "Beach",
    price: 150,
    rating: 4.7,
    reviews: 203,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beach-tennis-xcropygbV2cjvsHRe3TXQB8y2qdDXc.webp",
    amenities: ["Vista para o mar", "Chuveiro", "Bar", "Aluguel de equipamentos"],
    available: true,
    distance: "45 km",
    featured: false,
    premium: false,
  },
  {
    id: 5,
    name: "Futsal Pro",
    location: "Moema, São Paulo",
    sport: "Futsal",
    price: 90,
    rating: 4.5,
    reviews: 67,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2821%29-HwkXEU474l5Vc0nLjzSFaMrs5PezRg.png",
    amenities: ["Vestiário", "Iluminação LED", "Som ambiente"],
    available: true,
    distance: "4.1 km",
    featured: false,
    premium: false,
  },
  {
    id: 6,
    name: "Tennis Club Premium",
    location: "Jardins, São Paulo",
    sport: "Tênis",
    price: 200,
    rating: 4.9,
    reviews: 312,
    image: "/indoor-volleyball-court.png",
    amenities: ["Saibro", "Vestiário premium", "Estacionamento valet", "Lanchonete"],
    available: true,
    distance: "2.8 km",
    featured: true,
    premium: true,
  },
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedTab, setSelectedTab] = useState<"todos" | "mais-avaliadas">("todos")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Troca de imagem a cada 4 segundos

    return () => clearInterval(interval)
  }, [])

  const toggleFavorite = (courtId: number) => {
    setFavorites((prev) => (prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]))
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const filteredCourts = courts.filter((court) => {
    const matchesCategory = selectedCategory === "todos" || court.sport.toLowerCase().includes(selectedCategory)
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = court.price >= priceRange[0] && court.price <= priceRange[1]
    return matchesCategory && matchesSearch && matchesPrice
  })

  const displayedCourts =
    selectedTab === "mais-avaliadas" ? [...filteredCourts].sort((a, b) => b.rating - a.rating) : filteredCourts

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/30 to-white">
      {/* Fixed Header - Only top part */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white border-gray-100">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
                      <span className="text-white font-bold text-lg">CQ</span>
                    </div>
                    <div>
                      <Image
                        src="/clik-quadras-logo-transparent.png"
                        alt="Clik Quadras"
                        width={100}
                        height={35}
                        className="mb-1"
                      />
                      <p className="text-sm text-secondary-600">Encontre sua quadra ideal</p>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <Link
                      href="#"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition-all duration-200"
                    >
                      <Search className="h-5 w-5 text-primary-500" />
                      <span className="font-medium">Explorar</span>
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition-all duration-200"
                    >
                      <Heart className="h-5 w-5 text-primary-500" />
                      <span className="font-medium">Favoritos</span>
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition-all duration-200"
                    >
                      <CalendarIcon className="h-5 w-5 text-primary-500" />
                      <span className="font-medium">Minhas Reservas</span>
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition-all duration-200"
                    >
                      <Users className="h-5 w-5 text-primary-500" />
                      <span className="font-medium">Perfil</span>
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
                <span className="text-white font-bold">CQ</span>
              </div>
              <Image
                src="/clik-quadras-logo-transparent.png"
                alt="Clik Quadras"
                width={120}
                height={40}
                className="hidden sm:block"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-primary-500 hover:bg-primary-50 hover:text-primary-600">
              <Heart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 ring-2 ring-primary-200 cursor-pointer hover:ring-primary-300 transition-all">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-primary-500 text-white font-semibold">U</AvatarFallback>
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

      {/* Hero Section with Carousel */}
      <div className="relative min-h-[360px] md:min-h-[420px]">
        <div className="absolute inset-0">
          {/* Background photo */}
          <Image
            src={heroImages[currentImageIndex].src || "/placeholder.svg"}
            alt={heroImages[currentImageIndex].alt}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-opacity duration-500"
          />
          {/* Overlay para contraste do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Conteúdo do hero */}
        <div className="relative px-4 pb-8 pt-10 md:pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display">
                Encontre a quadra
                <br />
                <span className="text-secondary-300">perfeita para você</span>
              </h1>
              <p className="text-secondary-100 text-lg md:text-xl max-w-2xl mx-auto">
                Mais de 1000 quadras disponíveis em São Paulo com reserva instantânea
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto animate-fade-in">
              <div className="glass-effect rounded-2xl p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-200" />
                    <Input
                      placeholder="Buscar por local ou nome da quadra..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 h-12 bg-transparent border-0 text-white placeholder:text-secondary-200 focus:ring-0 text-lg"
                    />
                  </div>
                  <Button size="icon" className="h-12 w-12 btn-primary rounded-xl" onClick={() => setShowFilters(true)}>
                    <Filter className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "todos" ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory("todos")}
              className={`whitespace-nowrap rounded-full px-6 ${
                selectedCategory === "todos"
                  ? "btn-primary"
                  : "btn-secondary hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
              }`}
            >
              Todos
            </Button>
            {sportCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-6 ${
                  selectedCategory === category.id
                    ? "btn-primary"
                    : "btn-secondary hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Booking */}
      <div className="px-4 py-6 bg-gradient-to-r from-accent/50 to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="whitespace-nowrap btn-secondary rounded-xl px-6 h-12 bg-transparent"
                >
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
                  Selecionar Data
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-2xl border-0 shadow-xl max-w-sm p-0">
                <div className="p-6 border-b border-gray-100">
                  <DialogTitle className="text-secondary-800 text-xl text-center font-semibold">
                    Selecionar Data
                  </DialogTitle>
                </div>
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3 p-6 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="flex-1 btn-secondary rounded-xl bg-transparent"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Limpar
                  </Button>
                  <Button
                    className="flex-1 btn-primary rounded-xl"
                    onClick={() => {
                      /* Close dialog logic */
                    }}
                    disabled={!selectedDate}
                  >
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-40 btn-secondary rounded-xl h-12">
                <Clock className="h-5 w-5 mr-2 text-primary-500" />
                <SelectValue placeholder="Horário" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-xl">
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="10:00">10:00</SelectItem>
                <SelectItem value="14:00">14:00</SelectItem>
                <SelectItem value="16:00">16:00</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40 btn-secondary rounded-xl h-12">
                <Users className="h-5 w-5 mr-2 text-primary-500" />
                <SelectValue placeholder="Pessoas" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-xl">
                <SelectItem value="2-4">2-4 pessoas</SelectItem>
                <SelectItem value="5-10">5-10 pessoas</SelectItem>
                <SelectItem value="11-22">11-22 pessoas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              <div className="flex gap-2">
                <Button
                  variant={selectedTab === "todos" ? "default" : "ghost"}
                  onClick={() => setSelectedTab("todos")}
                  className={`rounded-xl px-6 py-3 font-medium transition-all ${
                    selectedTab === "todos"
                      ? "bg-primary-500 text-white shadow-lg"
                      : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
                  }`}
                >
                  Todas as Quadras
                </Button>
                <Button
                  variant={selectedTab === "mais-avaliadas" ? "default" : "ghost"}
                  onClick={() => setSelectedTab("mais-avaliadas")}
                  className={`rounded-xl px-6 py-3 font-medium transition-all ${
                    selectedTab === "mais-avaliadas"
                      ? "bg-primary-500 text-white shadow-lg"
                      : "text-secondary-600 hover:text-secondary-800 hover:bg-white/50"
                  }`}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Mais Avaliadas
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                {selectedTab === "mais-avaliadas"
                  ? `${displayedCourts.length} quadras mais avaliadas`
                  : `${displayedCourts.length} quadras encontradas`}
              </h2>
              <p className="text-secondary-600">
                {selectedTab === "mais-avaliadas"
                  ? "Ordenado por melhor avaliação"
                  : "Ordenado por relevância e avaliação"}
              </p>
            </div>
            <Button variant="outline" className="btn-secondary rounded-xl bg-transparent">
              <MapPin className="h-4 w-4 mr-2 text-primary-500" />
              Ver no Mapa
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourts.map((court) => (
              <Link href={`/quadra/${court.id}`} key={court.id}>
                <Card className="overflow-hidden group cursor-pointer card-hover livelo-card animate-fade-in">
                  <div className="relative">
                    <Image
                      src={court.image || "/placeholder.svg"}
                      alt={court.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Premium Badge */}
                    {court.premium && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-0 shadow-lg rounded-full px-3 py-1">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}

                    {/* Featured Badge */}
                    {court.featured && !court.premium && (
                      <Badge className="absolute top-3 left-3 bg-white/90 text-secondary-700 border-0 backdrop-blur-sm rounded-full px-3 py-1 font-medium">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-3 right-3 h-10 w-10 rounded-full glass-effect hover:bg-white/90 shadow-lg ${
                        favorites.includes(court.id) ? "text-primary-500" : "text-secondary-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(court.id)
                      }}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(court.id) ? "fill-current" : ""}`} />
                    </Button>

                    {/* Sport Badge */}
                    <Badge className="absolute bottom-3 left-3 bg-white/90 text-secondary-700 border-0 backdrop-blur-sm rounded-full px-3 py-1 font-medium">
                      {court.sport}
                    </Badge>

                    {/* Availability Status */}
                    {!court.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-2xl">
                        <Badge variant="destructive" className="shadow-lg rounded-full px-4 py-2">
                          Indisponível
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-secondary-800 mb-2 text-lg line-clamp-1">{court.name}</h3>
                        <p className="text-sm text-secondary-600 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                          {court.location} • {court.distance}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-black text-sm">{court.rating}</span>
                        <span className="text-black text-xs">({court.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {court.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {court.amenities.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                        >
                          +{court.amenities.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-secondary-800">R$ {court.price}</span>
                        <span className="text-sm text-secondary-600">/hora</span>
                      </div>
                      <Button
                        size="lg"
                        disabled={!court.available}
                        className={
                          court.available
                            ? "btn-primary rounded-xl px-6"
                            : "bg-secondary-200 text-secondary-500 rounded-xl px-6"
                        }
                      >
                        {court.available ? "Reservar" : "Indisponível"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 text-center livelo-card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 animate-fade-in">
              <div className="w-16 h-16 bg-sport-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-blue-glow">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-secondary-800 mb-2">1000+</h3>
              <p className="text-secondary-600 font-medium">Quadras disponíveis</p>
            </Card>

            <Card className="p-8 text-center livelo-card bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-secondary-800 mb-2">50k+</h3>
              <p className="text-secondary-600 font-medium">Usuários ativos</p>
            </Card>

            <Card className="p-8 text-center livelo-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-secondary-800 mb-2">4.8</h3>
              <p className="text-secondary-600 font-medium">Avaliação média</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md bg-white rounded-2xl border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-secondary-800 text-xl">Filtros</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-4 block text-secondary-800">Faixa de Preço (por hora)</label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={20} step={10} className="mb-3" />
              <div className="flex justify-between text-sm text-secondary-600 font-medium">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-4 block text-secondary-800">Comodidades</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Car, label: "Estacionamento" },
                  { icon: Droplets, label: "Chuveiro" },
                  { icon: Zap, label: "Iluminação" },
                  { icon: Shield, label: "Segurança" },
                  { icon: Wifi, label: "Wi-Fi" },
                  { icon: Camera, label: "Vestiário" },
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="justify-start btn-secondary rounded-xl p-3 h-auto hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 bg-transparent"
                  >
                    <Icon className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 btn-secondary rounded-xl bg-transparent"
                onClick={() => setShowFilters(false)}
              >
                Limpar
              </Button>
              <Button className="flex-1 btn-primary rounded-xl" onClick={() => setShowFilters(false)}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 md:hidden shadow-lg">
        <div className="flex items-center justify-around py-3">
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-3 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs font-medium">Explorar</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Reservas</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Button>
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
