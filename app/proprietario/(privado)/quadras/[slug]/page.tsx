// app/proprietario/quadras/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { deleteQuadra, approveQuadra } from './actions'
import { DeleteSubmit } from './DeleteSubmit'
import { ApproveSubmit } from './ApproveSubmit'
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel
} from '@/components/ui/alert-dialog'

function currencyBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

export default async function QuadraDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params // ✅ Next 15 requer await
  const supabase = createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: quadra, error } = await supabase
    .from('quadras')
    .select(`
      id, slug, nome, esporte, preco_hora, descricao, aprovado,
      imagens, comodidades, endereco
    `)
    .eq('slug', slug)           // ✅ usar slug resolvido
    .eq('owner_id', user.id)
    .single()

  if (error || !quadra) notFound()

  const imagens = (quadra.imagens as string[]) || []
  const comodidades = (quadra.comodidades as string[]) || []
  const endereco = (quadra.endereco as any) || {}

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const isAdmin = !!adminRow

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{quadra.nome}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={quadra.aprovado ? 'default' : 'secondary'}>
            {quadra.aprovado ? 'Aprovada' : 'Em revisão'}
          </Badge>
          <Link href="/proprietario/quadras">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {imagens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
              <div className="md:col-span-2 overflow-hidden rounded-lg">
                <img src={imagens[0]} alt={quadra.nome} className="h-72 w-full object-cover" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {imagens.slice(1, 5).map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-lg">
                    <img src={src} alt={`foto-${i + 2}`} className="h-36 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-60 grid place-items-center text-muted-foreground">Sem fotos</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground capitalize">
                Esporte: <span className="text-foreground">{String(quadra.esporte).replace('_', ' ')}</span>
              </div>
              <div className="font-semibold">{currencyBRL(Number(quadra.preco_hora || 0))}/h</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Descrição</div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{quadra.descricao || '—'}</p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Comodidades</div>
              {comodidades.length ? (
                <div className="flex flex-wrap gap-2">
                  {comodidades.map((c) => (
                    <Badge key={c} variant="secondary" className="capitalize">
                      {c.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma informada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-muted-foreground">CEP</div>
            <div className="font-medium">{endereco.cep || '—'}</div>
            <div className="text-muted-foreground mt-3">Endereço</div>
            <div className="font-medium">
              {(endereco.rua || '')}
              {endereco.numero ? `, ${endereco.numero}` : ''}
              {endereco.bairro ? ` — ${endereco.bairro}` : ''}
            </div>
            <div className="font-medium">
              {endereco.cidade || ''} {endereco.uf ? `- ${endereco.uf}` : ''}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <Link href={`/proprietario/quadras/${quadra.slug}/editar`}>
          <Button variant="outline">Editar</Button>
        </Link>

        {!quadra.aprovado && isAdmin && (
          <form action={approveQuadra.bind(null, quadra.slug)}>
            <ApproveSubmit />
          </form>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Excluir</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir esta quadra?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso removerá a quadra e todas as fotos associadas do Storage. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <form action={deleteQuadra.bind(null, quadra.slug)}>
                <DeleteSubmit />
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
