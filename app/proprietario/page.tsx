// app/proprietario/page.tsx
import { redirect } from "next/navigation"
import OwnerDashboard from "@/components/owner/OwnerDashboard"
import { listReservasDoOwner, listPendentesDoOwner } from "@/app/_data/reservas"
import { countQuadrasAtivasDoOwner } from "@/app/_data/quadras"
import { createSupabaseServer } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function ProprietarioPage() {
  // ✅ Auth guard
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/proprietario/acesso")

  // ✅ Carrega dados do banco em paralelo
  const [reservations, approvals, quadrasAtivas] = await Promise.all([
    listReservasDoOwner(),
    listPendentesDoOwner(),
    countQuadrasAtivasDoOwner(),
  ])

  return (
    <OwnerDashboard
      initialReservations={reservations}
      initialApprovals={approvals}
      quadrasAtivas={quadrasAtivas}
    />
  )
}
