// app/proprietario/quadras/page.tsx
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Quadra = {
  id: string
  slug: string
  nome: string
  esporte: string
  preco_hora: number | string | null
  imagens: string[] | null
  aprovado: boolean | null
  created_at: string
}

function currencyBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n)
}

function prettySport(s: string) {
  // troca _ por espaço; a classe `capitalize` cuida da 1ª letra
  // (usa replaceAll se disponível; fallback regex caso não tenha)
  // @ts-ignore - Node/TS antigos podem não ter replaceAll tipado
  return (s?.replaceAll?.("_", " ") ?? s.replace(/_/g, " "))
}

export default async function MinhasQuadrasPage() {
  const supabase = createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Você precisa entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/proprietario/acesso">Ir para o login do proprietário</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data, error } = await supabase
    .from("quadras")
    .select(
      "id, slug, nome, esporte, preco_hora, imagens, aprovado, created_at"
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro ao carregar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const quadras = (data ?? []) as Quadra[]
  const empty = quadras.length === 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* topo responsivo: título + ações */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Minhas quadras</h1>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button asChild className="rounded-full px-5">
            <Link href="/proprietario/quadras/nova">Cadastrar Quadra</Link>
          </Button>

          <Button asChild className="rounded-full px-5">
            <Link href="/proprietario">Dashboard</Link>
          </Button>
        </div>
      </div>

      {empty ? (
        <Card className="mt-6">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Você ainda não cadastrou nenhuma quadra.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/proprietario/quadras/nova">
                  Cadastrar a primeira quadra
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quadras.map((q) => {
            const cover = Array.isArray(q.imagens) ? q.imagens[0] : null
            const preco = Number(q.preco_hora ?? 0)

            return (
              <Card key={q.id} className="overflow-hidden">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={`Imagem da quadra ${q.nome}`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-40 w-full place-items-center bg-muted text-sm text-muted-foreground">
                    Sem foto
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{q.nome}</CardTitle>
                    <Badge variant={q.aprovado ? "default" : "secondary"}>
                      {q.aprovado ? "Aprovada" : "Em revisão"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="capitalize">{prettySport(q.esporte)}</span>
                    <span className="font-medium text-foreground">
                      {currencyBRL(preco)}/h
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/proprietario/quadras/${q.slug}`}>Ver</Link>
                    </Button>

                    <Button asChild size="sm" variant="outline">
                      <Link href={`/proprietario/quadras/${q.slug}/editar`}>
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
