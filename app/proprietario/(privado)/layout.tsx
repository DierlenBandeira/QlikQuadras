"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseBrowser } from "@/lib/supabase/client"

const tabs = [
  { href: "/proprietario", label: "Dashboard" },
  { href: "/proprietario/quadras", label: "Quadras" },
  { href: "/proprietario/reservas", label: "Reservas" },
  { href: "/proprietario/financeiro", label: "Financeiro" },
  { href: "/proprietario/configuracoes", label: "Configurações" },
]

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  const isLogin = pathname === "/proprietario/login"
  const isCadastro = pathname === "/proprietario/cadastro"

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // 1) /proprietario/login é sempre livre
      if (isLogin) {
        if (!cancelled) setReady(true)
        return
      }

      // 2) Checa sessão para todas as outras rotas (inclui /proprietario/cadastro)
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id

      if (!session) {
        // anônimo → sempre mandar pro login
        if (!cancelled) router.replace("/proprietario/login")
        return
      }

      // 3) Role
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .maybeSingle()

      const role = prof?.role

      if (isCadastro) {
        // /proprietario/cadastro:
        // - se já é owner → manda pro dashboard
        // - se não é owner → renderiza cadastro
        if (role === "owner") {
          if (!cancelled) router.replace("/proprietario")
          return
        }
        if (!cancelled) setReady(true)
        return
      }

      // 4) Demais rotas privadas (dashboard, quadras, etc.)
      if (role !== "owner") {
        if (!cancelled) router.replace("/proprietario/cadastro")
        return
      }

      // (opcional) checar owner_profiles/onboarding aqui

      if (!cancelled) setReady(true)
    })()

    return () => { cancelled = true }
  }, [isLogin, isCadastro, pathname, router, supabase])

  // Não mostra subheader no login/cadastro
  if (isLogin || isCadastro) {
    if (!ready && !isLogin) {
      // evita flicker no /proprietario/cadastro enquanto valida sessão/role
      return <div className="max-w-6xl mx-auto p-6 text-sm text-muted-foreground">Carregando…</div>
    }
    return <div className="min-h-screen">{children}</div>
  }

  if (!ready) {
    return <div className="max-w-6xl mx-auto p-6 text-sm text-muted-foreground">Carregando…</div>
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-2 py-3 overflow-x-auto">
            {tabs.map((t) => {
              const active = pathname === t.href
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={[
                    "rounded-full px-4 py-2 text-sm border transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "bg-white border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200",
                  ].join(" ")}
                >
                  {t.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      {children}
    </div>
  )
}
