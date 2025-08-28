"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const tabs = [
  { href: "/proprietario", label: "Dashboard" },
  { href: "/proprietario/quadras", label: "Quadras" },
  { href: "/proprietario/reservas", label: "Reservas" },
  { href: "/proprietario/financeiro", label: "Financeiro" },
  { href: "/proprietario/configuracoes", label: "Configurações" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/perfil?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const uid = session.user.id;

      // 1) checa role
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .maybeSingle();

      if (prof?.role !== "owner") {
        router.replace("/"); // não é dono
        return;
      }

      // 2) checa onboarding
      const { data: owner } = await supabase
        .from("owner_profiles")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!owner && pathname !== "/proprietario/onboarding") {
        router.replace("/proprietario/onboarding");
        return;
      }

      setReady(true);
    })();
  }, [pathname]);

  if (!ready) {
    return <div className="max-w-6xl mx-auto p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  return (
    <div className="min-h-screen">
      {/* subheader com navegação */}
      <div className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-2 py-3 overflow-x-auto">
            {tabs.map(t => {
              const active = pathname === t.href;
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
              );
            })}
          </nav>
        </div>
      </div>

      {/* conteúdo da página */}
      {children}
    </div>
  );
}
