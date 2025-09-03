// app/quadra/[slug]/components/OwnerCard.tsx
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone } from "lucide-react"

type Props = {
  ownerName: string
  phone?: string
}

export default function OwnerCard({ ownerName, phone }: Props) {
  const initials = ownerName.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 3) || "A"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 lg:h-16 lg:w-16">
            <AvatarFallback className="text-sm lg:text-lg">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-3 lg:text-lg">{ownerName}</h3>

            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs text-muted-foreground">Telefone</span>
                </div>
                <span className="font-semibold tabular-nums text-sm lg:text-base">
                  {phone || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
