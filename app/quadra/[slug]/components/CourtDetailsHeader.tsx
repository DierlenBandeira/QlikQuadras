// app/quadra/[slug]/components/CourtDetailsHeader.tsx
"use client"
import { ArrowLeft, Heart, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CourtDetailsHeader() {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsFavorite((v) => !v)}>
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary-500 text-primary-500" : ""}`} />
          </Button>
        </div>
      </div>
    </header>
  )
}
