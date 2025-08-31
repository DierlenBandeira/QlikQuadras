// app/proprietario/(privado)/reservas/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReservasList from "@/components/reservas/ReservasList"
import { listReservasDoOwner } from "@/app/_data/reservas"
import { toISOorNull } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Search = { status?: string; from?: string; to?: string }

export default async function ReservasPage({ searchParams }: { searchParams: Search }) {
  // ----- sanitização -----
  const VALID = new Set(["confirmed", "canceled", "pending"] as const)
  const rawStatus = (searchParams?.status ?? "").toString()
  const status: "confirmed" | "canceled" | "pending" | null =
    VALID.has(rawStatus as any) ? (rawStatus as any) : null
  // "all" ou vazio => null (sem filtro)

  const fromISO = toISOorNull(searchParams?.from ?? null)
  const toISO   = toISOorNull(searchParams?.to ?? null)

  // ----- chamada de dados -----
  const rows = await listReservasDoOwner({
    status,        // agora status é null ou um dos válidos
    from: fromISO, // ISO ou null
    to: toISO,     // ISO ou null
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <div className="flex gap-2">
          <Button asChild className="rounded-full">
            <Link href="/proprietario/quadras">Minhas quadras</Link>
          </Button>
        </div>
      </div>

      {/* ex: ?status=confirmed | ?from=2025-09-01T00:00:00Z&to=2025-09-30T23:59:59Z */}
      <ReservasList initialRows={rows} />
    </div>
  )
}
