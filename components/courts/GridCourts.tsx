'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Award, Sparkles, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CourtCard } from '@/lib/quadras/list'

// Props: dados já vindos do server
export default function GridCourts({ initialCourts }: { initialCourts: CourtCard[] }) {
  const [selectedTab, setSelectedTab] = useState<'todos' | 'mais-avaliadas'>('todos')
  const [favorites, setFavorites] = useState<string[]>([])

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const displayedCourts = useMemo(() => {
    if (selectedTab === 'mais-avaliadas') {
      // até termos avaliação real, mantém um sort estável pelo name (ou rating se vier)
      return [...initialCourts].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }
    return initialCourts
  }, [selectedTab, initialCourts])

  return (
    <main className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex gap-2">
              <Button
                variant={selectedTab === 'todos' ? 'default' : 'ghost'}
                onClick={() => setSelectedTab('todos')}
                className={`rounded-xl px-6 py-3 font-medium transition-all ${
                  selectedTab === 'todos'
                    ? 'bg-primary-500 text-black shadow-lg'
                    : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
                }`}
              >
                Todas as Quadras
              </Button>
              <Button
                variant={selectedTab === 'mais-avaliadas' ? 'default' : 'ghost'}
                onClick={() => setSelectedTab('mais-avaliadas')}
                className={`rounded-xl px-6 py-3 font-medium transition-all ${
                  selectedTab === 'mais-avaliadas'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-600 hover:text-secondary-800 hover:bg-white/50'
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
              {selectedTab === 'mais-avaliadas'
                ? `${displayedCourts.length} quadras mais avaliadas`
                : `${displayedCourts.length} quadras encontradas`}
            </h2>
            <p className="text-secondary-600">
              {selectedTab === 'mais-avaliadas'
                ? 'Ordenado por melhor avaliação'
                : 'Ordenado por relevância e avaliação'}
            </p>
          </div>
          <Button variant="outline" className="btn-secondary rounded-xl bg-transparent">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            Ver no Mapa
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourts.map((court) => (
            // 🔁 Ajuste principal: use o SLUG na URL pública
            <Link href={`/quadra/${court.slug}`} key={court.id}>
              <Card className="overflow-hidden group cursor-pointer card-hover livelo-card animate-fade-in">
                <div className="relative">
                  <Image
                    src={court.image || '/placeholder.svg'}
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
                      favorites.includes(court.id) ? 'text-primary-500' : 'text-secondary-600'
                    }`}
                    onClick={(e) => {
                      e.preventDefault() // não navegar ao favoritar
                      toggleFavorite(court.id)
                    }}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(court.id) ? 'fill-current' : ''}`} />
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
                        {court.location}
                        {/* só mostra “• distância” se existir */}
                        {court.distance ? <> • {court.distance}</> : null}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-black text-sm">{court.rating ?? 0}</span>
                      <span className="text-black text-xs">({court.reviews ?? 0})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(court.amenities ?? []).slice(0, 3).map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {(court.amenities?.length ?? 0) > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                      >
                        +{(court.amenities?.length ?? 0) - 3}
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
                          ? 'btn-primary rounded-xl px-6'
                          : 'bg-secondary-200 text-secondary-500 rounded-xl px-6'
                      }
                    >
                      {court.available ? 'Reservar' : 'Indisponível'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
