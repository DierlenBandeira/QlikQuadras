import HomeClient from '@/components/home/HomeClient'
import { fetchApprovedCourts } from '@/lib/quadras/list'

export default async function HomePage() {
  const courts = await fetchApprovedCourts() // Supabase aqui
  return <HomeClient initialCourts={courts} /> // passa os dados prontos
}
