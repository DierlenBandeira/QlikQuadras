"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function SupabaseDebug() {
  const supabase = createSupabaseBrowser();
  const [status, setStatus] = useState("checando…");

  useEffect(() => {
    // getSession NÃO erra quando não há sessão
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus("erro: " + error.message);
      } else {
        setStatus(data.session ? "logado" : "deslogado (ok)");
      }
    });
  }, []);

  return (
    <div className="p-6 text-lg">
      Supabase: <b>{status}</b>
    </div>
  );
}
