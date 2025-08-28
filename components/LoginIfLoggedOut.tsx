"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginIfLoggedOut() {
  const supabase = createSupabaseBrowser();
  const [logged, setLogged] = useState<boolean | null>(null); // null = carregando

    useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLogged(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
        setLogged(!!sess); // se não houver sessão, vira false na hora
    });
    return () => subscription.unsubscribe();
    }, []);


  if (logged === null) return null;     // evita flicker
  if (logged) return null;              // logado: não mostra nada

  // deslogado: mostra o link "Login"
  return (
    <Link
      href="/perfil"
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2
                 text-secondary-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700
                 transition-colors"
    >
      Login
    </Link>
  );
}
