import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReservasList from "@/components/reservas/ReservasList"
import { listReservasDoOwner } from "@/app/_data/reservas"

export const dynamic = "force-dynamic"

export default async function ReservasPage({
  searchParams,
}: { searchParams: { status?: string; from?: string; to?: string } }) {
  const statusParam = (searchParams?.status ?? "all") as any
  const rows = await listReservasDoOwner({
    status: ["confirmed","canceled","pending","all"].includes(statusParam) ? statusParam : "all",
    from: searchParams?.from,
    to: searchParams?.to,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <div className="flex gap-2">
          <Button asChild className="rounded-full"><Link href="/proprietario/quadras">Minhas quadras</Link></Button>
        </div>
      </div>

      {/* opcional: filtros por querystring */}
      {/* ex: ?status=confirmed  |  ?from=2025-09-01T00:00:00Z&to=2025-09-30T23:59:59Z */}

      <ReservasList initialRows={rows} />
    </div>
  )
}
