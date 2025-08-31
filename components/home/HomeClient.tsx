'use client'

import type { CourtCard } from '@/lib/quadras/list'
import GridCourts from '@/components/courts/GridCourts'

import AppHeader from '@/components/layout/AppHeader'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import UserGreeting from '@/components/UserGreeting'
import LoginIfLoggedOut from '@/components/LoginIfLoggedOut'
import LogoutMenuItem from '@/components/LogoutMenuItem'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  Search, Menu, MapPin, Star, Heart, Filter,
  Calendar as CalendarIcon, Clock, Users, Wifi, Car, Zap, Droplets, Shield, Camera,
  Sparkles, Award, Settings, Building2
} from 'lucide-react'

type Props = { initialCourts: CourtCard[] }

const sportCategories = [
  { id: 'todos',   name: 'Todos',   icon: '🎯' },
  { id: 'futebol', name: 'Futebol', icon: '⚽' },
  { id: 'volei',   name: 'Vôlei',   icon: '🏐' },
  { id: 'basquete',name: 'Basquete',icon: '🏀' },
  { id: 'tenis',   name: 'Tênis',   icon: '🎾' },
  { id: 'salao',   name: 'Salão',  icon: '⚽' },
  { id: 'beach',   name: 'Beach Tennis',   icon: '🏖️' }, // label visual; no dado vem 'Beach Tênis'
]

const heroImages = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem%20%2821%29-HwkXEU474l5Vc0nLjzSFaMrs5PezRg.png', alt: 'Bola de futebol Nike em grama sintética em arena esportiva coberta' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagem.jpg-rGwJdEQjTplMX0w7Afzl7icQWAQF27.jpeg', alt: 'Jogadores em quadra indoor de futebol com grama sintética' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beach-tennis-xcropygbV2cjvsHRe3TXQB8y2qdDXc.webp', alt: 'Raquetes coloridas de beach tennis na areia com jogadores ao fundo' },
  { src: '/indoor-volleyball-court.png', alt: 'Quadra de vôlei indoor com iluminação profissional' },
  { src: '/indoor-basketball-arena.png', alt: 'Quadra de basquete indoor com arquibancadas' },
]

const formatBtnLabel = (d?: Date) => {
  if (!d) return 'Selecionar Data'
  const day = d.toLocaleDateString('pt-BR', { day: 'numeric' })
  const month = d.toLocaleDateString('pt-BR', { month: 'long' })
  const cap = month.charAt(0).toUpperCase() + month.slice(1)
  return `${day} de ${cap}`
}

export default function HomeClient({ initialCourts }: Props) {
  // ====== estados de UI ======
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [draftDate, setDraftDate] = useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | undefined>()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 300])
  const [favorites, setFavorites] = useState<string[]>([]) // ids vêm como string do banco
  const [selectedTab, setSelectedTab] = useState<'todos' | 'mais-avaliadas'>('todos')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const toggleFavorite = (courtId: string) => {
    setFavorites((prev) => (prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]))
  }

  // ====== filtros locais (em memória) ======
  const filteredCourts = initialCourts.filter((court) => {
    const cat = selectedCategory
    const sportNormalized = court.sport.toLowerCase() // ex.: 'Vôlei' → 'vôlei'
    const matchesCategory =
      cat === 'todos' ||
      sportNormalized.includes(cat) ||
      (cat === 'beach' && sportNormalized.includes('beach')) ||
      (cat === 'salao' && sportNormalized.includes('salão')) // tolera acento
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = court.price >= priceRange[0] && court.price <= priceRange[1]
    return matchesCategory && matchesSearch && matchesPrice
  })

  const displayedCourts =
    selectedTab === 'mais-avaliadas'
      ? [...filteredCourts].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      : filteredCourts

  // estilos para o Calendar
  const rdpVars: React.CSSProperties = {
    ['--rdp-accent-color' as any]: 'hsl(var(--primary))',
    ['--rdp-accent-color-dark' as any]: 'hsl(var(--primary))',
    ['--rdp-background-color' as any]: 'hsl(var(--primary) / 0.12)',
    ['--rdp-outline' as any]: '2px solid hsl(var(--primary) / 0.35)',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/30 to-white">

      {/* Hero */}
      <div className="relative min-h-[360px] md:min-h-[420px]">
        <div className="absolute inset-0">
          <Image
            src={heroImages[currentImageIndex].src || '/placeholder.svg'}
            alt={heroImages[currentImageIndex].alt}
            fill sizes="100vw" priority
            className="object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i===currentImageIndex?'bg-white scale-110':'bg-white/50 hover:bg-white/70'}`}
              onClick={() => setCurrentImageIndex(i)}
            />
          ))}
        </div>

        <div className="relative px-4 pb-8 pt-10 md:pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display">
                Encontre a quadra<br /><span className="text-3xl md:text-5xl font-bold text-white mb-3 font-display">perfeita para você</span>
              </h1>
              <p className=" text-lg md:text-xl max-w-2xl mx-auto text-white">
                Quadras disponíveis por toda nossa cidade de Caxias do Sul
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-3xl mx-auto">
              <div className="rounded-2xl p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-250" />
                    <Input
                      placeholder="Buscar por local ou nome da quadra..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 h-12 bg-white border-0 text-primary-250 placeholder:text-primary-250 focus:ring-0 text-lg"
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
          <div className="flex gap-3 overflow-x-visible overflow-y-visible pb-2 py-1">
            {sportCategories.map((category) => (
              <Button
                key={category.id}
                size="lg"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full h-12 px-6 border shadow-none ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-600'
                    : 'bg-white text-gray-900 border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Booking (data/horário) */}
      <div className="px-4 py-6 bg-gradient-to-r from-accent/50 to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto">
            {/* Seletor de Data */}
            <Dialog
              open={openDate}
              onOpenChange={(o) => { setOpenDate(o); if (o) setDraftDate(date) }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-48 h-12 rounded-full px-6 flex items-center justify-between hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                  <span className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
                    {formatBtnLabel(date)}
                  </span>
                  <svg className="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-white rounded-2xl border-0 shadow-xl max-w-sm p-0 z-[80]">
                <div className="p-6 border-b border-gray-100">
                  <DialogTitle className="text-secondary-800 text-xl text-center font-semibold">Selecionar Data</DialogTitle>
                </div>
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={draftDate}
                    onSelect={setDraftDate}
                    disabled={{ before: today }}
                    initialFocus
                    style={rdpVars}
                  />
                </div>
                <div className="flex gap-3 p-6 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => { setDraftDate(undefined); setDate(undefined) }}>
                    Limpar
                  </Button>
                  <DialogClose asChild>
                    <Button className="flex-1 btn-primary rounded-xl" disabled={!draftDate} onClick={() => { if (draftDate) setDate(draftDate) }}>
                      Confirmar
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Horário */}
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-40 h-12 rounded-full px-6 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                <Clock className="h-5 w-5 mr-2 text-primary-500" />
                <SelectValue placeholder="Horário" />
              </SelectTrigger>
              <SelectContent sideOffset={8} className="rounded-xl border bg-white shadow-xl z-[70] p-1">
                {['08:00','10:00','14:00','16:00','18:00','20:00'].map(v => (
                  <SelectItem key={v} value={v} className="my-1 rounded-md">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pessoas (mock visual) */}
            <Select>
              <SelectTrigger className="w-40 h-12 rounded-full px-6 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                <Users className="h-5 w-5 mr-2 text-primary-500" />
                <SelectValue placeholder="Pessoas" />
              </SelectTrigger>
              <SelectContent sideOffset={8} className="bg-white rounded-xl border-0 shadow-xl z-[70] p-1">
                <SelectItem value="2-4">2-4 pessoas</SelectItem>
                <SelectItem value="5-10">5-10 pessoas</SelectItem>
                <SelectItem value="11-22">11-22 pessoas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* === GRID das quadras (dados do Supabase filtrados localmente) === */}
      <GridCourts initialCourts={displayedCourts} />

      {/* Stats (visual) */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
        <Card className="p-8 text-center livelo-card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="w-16 h-16 bg-sport-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-blue-glow"><Star className="h-8 w-8 text-white" /></div>
          <h3 className="text-3xl font-bold text-secondary-800 mb-2">1000+</h3>
          <p className="text-secondary-600 font-medium">Quadras disponíveis</p>
        </Card>

        <Card className="p-8 text-center livelo-card bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Users className="h-8 w-8 text-white" /></div>
          <h3 className="text-3xl font-bold text-secondary-800 mb-2">50k+</h3>
          <p className="text-secondary-600 font-medium">Usuários ativos</p>
        </Card>

        <Card className="p-8 text-center livelo-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Star className="h-8 w-8 text-white" /></div>
          <h3 className="text-3xl font-bold text-secondary-800 mb-2">4.8</h3>
          <p className="text-secondary-600 font-medium">Avaliação média</p>
        </Card>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 md:hidden shadow-lg">
        <div className="flex items-center justify-around py-3">
          <Button variant="ghost" className="flex-col gap-1 h-auto py-3 text-primary-500 hover:text-primary-600 hover:bg-primary-50">
            <Search className="h-5 w-5" /><span className="text-xs font-medium">Explorar</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50">
            <Heart className="h-5 w-5" /><span className="text-xs font-medium">Favoritos</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50">
            <CalendarIcon className="h-5 w-5" /><span className="text-xs font-medium">Reservas</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1 h-auto py-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50">
            <Users className="h-5 w-5" /><span className="text-xs font-medium">Perfil</span>
          </Button>
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  )
}
