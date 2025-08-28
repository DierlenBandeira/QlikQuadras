"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function OwnerHero() {
  const supabase = createSupabaseBrowser();
  const [firstName, setFirstName] = useState<string | null>(null);

  async function loadName() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setFirstName(null); return; }

    const user = session.user;

    // tenta profiles.display_name; depois full_name do auth; por fim prefixo do email
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    const full =
      profile?.display_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0];

    const first = (full ?? "").trim().split(/\s+/)[0] || null;
    setFirstName(first);
  }

  useEffect(() => {
    loadName();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => loadName());
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/10 via-white to-white shadow-lg">
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Bem-vindo de volta,{" "}
            <span className="text-primary">
              Proprietário{firstName ? ` ${firstName}` : ""}
            </span>{" "}
            👋
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gerencie reservas, aprove solicitações e acompanhe seus resultados.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/proprietario/quadras"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition"
          >
            Minhas Quadras
          </a>
          <a
            href="/proprietario/quadras/nova"
            className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow hover:bg-primary/90 transition"
          >
            Cadastrar Quadra
          </a>
        </div>
      </div>
    </div>
  );
}
