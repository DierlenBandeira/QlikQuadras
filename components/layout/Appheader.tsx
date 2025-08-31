// components/layout/AppHeader.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, Heart, Calendar as CalendarIcon, Users, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Greetings from '@/components/Greetings' // 👈 unificado (saudação + login/avatar)

type AppHeaderProps = {
  showOwnerLink?: boolean
}

export default function AppHeader({ showOwnerLink = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/100 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex items-center p-4 max-w-7xl mx-auto">
        {/* ESQUERDA: menu mobile + logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-80 bg-white border-gray-100">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
                    <span className="text-white font-bold text-lg">QQ</span>
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
                  <Link href="/" className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition">
                    <Search className="h-5 w-5 text-primary-500" />
                    <span className="font-medium">Explorar</span>
                  </Link>

                  <Link href="/favoritos" className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition">
                    <Heart className="h-5 w-5 text-primary-500" />
                    <span className="font-medium">Favoritos</span>
                  </Link>

                  <Link href="/reservas" className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition">
                    <CalendarIcon className="h-5 w-5 text-primary-500" />
                    <span className="font-medium">Minhas Reservas</span>
                  </Link>

                  <Link href="/perfil" className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition">
                    <Users className="h-5 w-5 text-primary-500" />
                    <span className="font-medium">Perfil</span>
                  </Link>

                  {showOwnerLink && (
                    <Link href="/proprietario" className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-600 transition">
                      <Building2 className="h-5 w-5 text-primary-500" />
                      <span className="font-medium">Área do Proprietário</span>
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sport-gradient rounded-2xl flex items-center justify-center shadow-blue-glow">
              <Image
                src="/clik-quadras-icon-transparent.png"
                alt="Qlick Quadras"
                width={60}
                height={60}
                className="w-14 h-auto inline-block"
                priority
              />
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

        {/* SPACER */}
        <div className="flex-1" />

        {/* DIREITA: saudação + auth + favoritos */}
        <div className="flex items-center gap-4">
            <Greetings showOwnerLink={showOwnerLink} />
            <Button variant="ghost" size="icon" className="text-primary-500 hover:bg-primary-50 hover:text-primary-600" aria-label="Favoritos">
                <Heart className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </header>
  )
}
