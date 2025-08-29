"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProprietarioLoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Login com Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setError("E-mail ou senha inválidos.")
      setLoading(false)
      return
    }

    // Sucesso → o layout decide (dashboard / cadastro / onboarding)
    router.replace("/proprietario")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Acesse sua Conta</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para gerenciar suas quadras
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Login do Proprietário</CardTitle>
            <CardDescription>Digite seus dados para acessar sua conta</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email-login">E-mail</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha-login">Senha</Label>
                <Input
                  id="senha-login"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id="lembrar"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(Boolean(v))}
                  />
                  Lembrar de mim
                </label>

                <Link href="/proprietario/esqueci-minha-senha" className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem conta?{" "}
                  <Link href="/proprietario/cadastro" className="text-primary hover:underline">
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
