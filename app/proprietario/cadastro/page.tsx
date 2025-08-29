"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProprietarioCadastroPage() {
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // campos básicos (compatíveis com seu schema atual)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [documento, setDocumento] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // sessão
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace("/proprietario/login")
        return
      }
      const uid = session.user.id

      // se já é owner → manda pro dashboard
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("display_name, phone, city, role")
        .eq("id", uid)
        .maybeSingle()

      if (profErr) {
        console.error(profErr)
        if (mounted) {
          setError("Não foi possível carregar seu perfil.")
          setLoading(false)
        }
        return
      }

      if (prof?.role === "owner") {
        router.replace("/proprietario")
        return
      }

      // pré-preencher
      if (mounted) {
        setNome(prof?.display_name || session.user.user_metadata?.full_name || "")
        setEmail(session.user.email || "")
        setTelefone(prof?.phone || "")
        setLoading(false) // ✅ importante!
      }
    })()

    return () => { mounted = false }
  }, [router, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.replace("/proprietario/login")
      return
    }
    const uid = session.user.id

    // upsert em owner_profiles (🟢 usa player_id + onConflict correto)
    const { error: ownerErr } = await supabase
      .from("owner_profiles")
      .upsert(
        {
          player_id: uid,          // <-- seu PK/FK
          nome_fantasia: nome,
          telefone,
          documento,
        },
        { onConflict: "player_id" } // <-- índice de conflito correto
      )

    if (ownerErr) {
      console.error(ownerErr)
      setSaving(false)
      setError("Não foi possível salvar seu cadastro. Tente novamente.")
      return
    }

    // promove role para 'owner'
    const { error: roleErr } = await supabase
      .from("profiles")
      .update({ role: "owner" })
      .eq("id", uid)

    if (roleErr) {
      console.error(roleErr)
      setSaving(false)
      setError("Cadastro salvo, mas não foi possível atualizar sua função para proprietário.")
      return
    }

    // sucesso → dashboard (ou /proprietario/onboarding, se preferir)
    router.replace("/proprietario")
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 text-sm text-muted-foreground">Carregando…</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Torne-se Proprietário</h1>
          <p className="text-muted-foreground">Complete seus dados para gerenciar suas quadras</p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Cadastro do Proprietário</CardTitle>
            <CardDescription>Revise os dados e conclua o cadastro</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome / Nome Fantasia</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">Documento (CPF/CNPJ)</Label>
                <Input id="documento" value={documento} onChange={(e) => setDocumento(e.target.value)} />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
