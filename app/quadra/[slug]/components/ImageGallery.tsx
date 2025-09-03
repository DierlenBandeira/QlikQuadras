// app/quadra/[slug]/components/ImageGallery.tsx
"use client"
import Image from "next/image"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type Props = {
  images: string[]
  title: string
  onOpenAll: () => void
}

export default function ImageGallery({ images, title, onOpenAll }: Props) {
  const [selected, setSelected] = useState(0)
  const next = () => setSelected((p) => (p + 1) % images.length)
  const prev = () => setSelected((p) => (p - 1 + images.length) % images.length)

  return (
    <div className="relative">
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div className="relative aspect-[4/3]">
          <Image src={images[selected] || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setSelected(i)} className={`w-2 h-2 rounded-full ${selected === i ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-2 h-96">
          <div className="col-span-2 row-span-2 relative rounded-l-lg overflow-hidden">
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={onOpenAll}
            />
          </div>
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Foto ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={onOpenAll}
              />
              {index === 3 && images.length > 5 && (
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
                  onClick={onOpenAll}
                >
                  <span className="text-white font-semibold">+{images.length - 5} fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="default"
          className="absolute bottom-4 right-4 btn-primary rounded-xl shadow-lg"
          onClick={onOpenAll}
        >
          <Camera className="h-4 w-4 mr-2" />
          Ver todas as fotos
        </Button>
      </div>
    </div>
  )
}
