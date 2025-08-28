"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OwnerOnboarding() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // opcional: preencher com dados do profile
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/perfil"); return; }
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, city")
        .eq("id", session.user.id)
        .maybeSingle();

      if (prof?.display_name) setBusinessName(prof.display_name);
      if (prof?.city) setCity(prof.city);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setErr("Faça login"); setBusy(false); return; }

    // garante o papel de owner
    await supabase.from("profiles")
      .update({ role: "owner" })
      .eq("id", session.user.id);

    // cria o registro do proprietário
    const { error } = await supabase.from("owner_profiles").insert({
      user_id: session.user.id,
      business_name: businessName.trim(),
      contact_phone: phone.trim(),
      city: city.trim(),
    });

    setBusy(false);
    if (error) { setErr(error.message); return; }

    router.replace("/proprietario");
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Seja um proprietário</h1>
      <p className="text-muted-foreground text-sm">
        Precisamos de algumas informações para liberar o seu dashboard.
      </p>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Nome do negócio</Label>
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </div>
        <div>
          <Label>Telefone de contato</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Salvando..." : "Concluir onboarding"}
        </Button>
      </form>
    </div>
  );
}
