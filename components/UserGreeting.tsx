"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function UserGreeting() {
  const supabase = createSupabaseBrowser();
  const [firstName, setFirstName] = useState<string | null>(null);

  async function computeName() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setFirstName(null); return; }

    const user = session.user;
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
    computeName();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setFirstName(null);     // limpa na hora
        return;
      }
      // SIGNED_IN / TOKEN_REFRESHED
      await computeName();
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!firstName) return null;
  return <span className="font-semibold">Olá, {firstName}!</span>;
}
