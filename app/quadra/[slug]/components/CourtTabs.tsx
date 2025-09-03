// app/quadra/[slug]/components/CourtTabs.tsx
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation, Map, Shield } from "lucide-react"

type Props = {
  description: string
  amenities: string[]
  address: string
}

export default function CourtTabs({ description, amenities, address }: Props) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto">
        <TabsTrigger value="about" className="text-xs py-2 lg:text-sm">Sobre</TabsTrigger>
        <TabsTrigger value="amenities" className="text-xs py-2 lg:text-sm">Comodidades</TabsTrigger>
        <TabsTrigger value="location" className="text-xs py-2 lg:text-sm">Localização</TabsTrigger>
      </TabsList>

      {/* SOBRE */}
      <TabsContent value="about" className="space-y-4 mt-4 lg:space-y-6 lg:mt-6">
        <div>
          <h2 className="text-lg font-semibold mb-3 lg:text-xl lg:mb-4">Sobre a quadra</h2>
          <p className="text-sm text-muted-foreground leading-relaxed lg:text-base">
            {description}
          </p>
        </div>
      </TabsContent>

      {/* COMODIDADES (sem descrição) */}
      <TabsContent value="amenities" className="mt-4 lg:mt-6">
        <div className="grid gap-3 lg:gap-4">
          {amenities.length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhuma comodidade informada.</div>
          )}
          {amenities.map((amenity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Shield className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
              </div>
              <span className="font-medium text-sm lg:text-base">{amenity}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* LOCALIZAÇÃO */}
      <TabsContent value="location" className="mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Endereço</h3>
            <p className="text-muted-foreground">{address}</p>
          </div>

          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Mapa interativo</p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border rounded-md py-2 text-sm flex items-center justify-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Abrir no Google Maps
          </a>
        </div>
      </TabsContent>
    </Tabs>
  )
}
