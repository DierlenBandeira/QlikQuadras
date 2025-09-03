// app/checkout/page.tsx
import CheckoutClient from "./CheckoutClient"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const court = {
    id: String(sp.qid ?? sp.quadra ?? "court-1"),
    name: String(sp.name ?? sp.slug ?? "Quadra"),
    location: String(sp.loc ?? "—"),
    price: Number(sp.price ?? 0),
    image: String(sp.img ?? "/placeholder.svg"),
  }

  const isoDate = String(sp.date ?? "")
  const time = String(sp.time ?? "")

  // Se preferir, você pode passar esses dados como props pro Client.
  return <CheckoutClient /* court={court} isoDate={isoDate} time={time} */ />
}
