'use client'

import * as React from 'react'
import Link from 'next/link'
import { createQuadra } from './actions'
import { createSupabaseBrowser } from '@/lib/supabase/browser'
import { PendingOverlay } from '@/components/form/PendingOverlay'
import { SubmitButton } from '@/components/form/SubmitButton'
import { Plus, MapPin, DollarSign, Camera, Upload, X } from 'lucide-react'

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type OwnerInfo = { nome?: string; telefone?: string; cpf_cnpj?: string; email?: string }
type Preview = { file: File; url: string }

export default function NovaQuadraPage() {
  // Proprietário
  const [owner, setOwner] = React.useState<OwnerInfo>({})

  // Endereço refs (para ViaCEP)
  const ruaRef = React.useRef<HTMLInputElement | null>(null)
  const bairroRef = React.useRef<HTMLInputElement | null>(null)
  const cidadeRef = React.useRef<HTMLInputElement | null>(null)
  const ufRef = React.useRef<HTMLInputElement | null>(null)

  // Upload
  const [previews, setPreviews] = React.useState<Preview[]>([])
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  // Toast simples (erros do client)
  const [toast, setToast] = React.useState<string>('')

  React.useEffect(() => {
    const supa = createSupabaseBrowser()
    ;(async () => {
      const { data: { user } } = await supa.auth.getUser()
      if (user) {
        setOwner({
          nome: (user.user_metadata as any)?.name || (user.user_metadata as any)?.full_name || '',
          telefone: (user.user_metadata as any)?.phone || '',
          cpf_cnpj: (user.user_metadata as any)?.cpf || (user.user_metadata as any)?.cnpj || '',
          email: user.email ?? '',
        })
      }
    })()
  }, [])

  React.useEffect(() => () => previews.forEach(p => URL.revokeObjectURL(p.url)), [previews])

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.currentTarget.value.replace(/\D/g, '')
    if (cep.length !== 8) return
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const d = await r.json()
      if (!d?.erro) {
        if (ruaRef.current) ruaRef.current.value = d.logradouro ?? ''
        if (bairroRef.current) bairroRef.current.value = d.bairro ?? ''
        if (cidadeRef.current) cidadeRef.current.value = d.localidade ?? ''
        if (ufRef.current) ufRef.current.value = d.uf ?? ''
      }
    } catch {
      setToast('Não foi possível consultar o CEP agora.')
    }
  }

  function validateFiles(files: File[]): string | null {
    if (files.length > 10) return 'Máximo de 10 fotos.'
    const bad = files.find(
      f => f.size > 10 * 1024 * 1024 || !['image/png','image/jpg','image/jpeg','image/webp'].includes(f.type)
    )
    if (bad) {
      if (bad.size > 10 * 1024 * 1024) return `“${bad.name}” excede 10MB.`
      return `Formato inválido em “${bad.name}”. Use PNG/JPG/JPEG/WEBP.`
    }
    return null
  }

  function applyToInput(fs: File[]) {
    const dt = new DataTransfer()
    fs.forEach(f => dt.items.add(f))
    if (fileRef.current) fileRef.current.files = dt.files
  }

  function onFilesSelected(list: FileList | null) {
    const files = Array.from(list ?? [])
    const next = [...previews, ...files.map(file => ({ file, url: URL.createObjectURL(file) }))]
    const err = validateFiles(next.map(n => n.file))
    if (err) {
      files.forEach(f => {
        const p = next.find(n => n.file === f)
        if (p) URL.revokeObjectURL(p.url)
      })
      setToast(err); return
    }
    setPreviews(next)
    applyToInput(next.map(n => n.file))
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    if (!files.length) return
    onFilesSelected({
      length: files.length,
      item: (i: number) => files[i],
      [Symbol.iterator]: function* () { for (let i = 0; i < files.length; i++) yield files[i] } as any,
    } as unknown as FileList)
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const removePreview = (idx: number) => {
    const next = previews.slice()
    const [rm] = next.splice(idx, 1)
    if (rm) URL.revokeObjectURL(rm.url)
    setPreviews(next)
    applyToInput(next.map(n => n.file))
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Toast simples */}
      {toast && (
        <div className="mb-4 rounded-lg bg-red-600 px-4 py-3 text-white">
          <div className="flex items-start justify-between gap-3">
            <span>⚠️ {toast}</span>
            <button onClick={() => setToast('')} className="opacity-80 hover:opacity-100">✖</button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Informações da Quadra
          </CardTitle>
          <CardDescription>Preencha os dados da sua quadra para disponibilizá-la para locação</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <form action={createQuadra} className="space-y-8">
            {/* Tipo de Esporte (seleção ÚNICA; valores compatíveis com o backend) */}
            <section className="space-y-4">
              <Label className="text-base font-semibold">Tipo de Esporte *</Label>
              <p className="text-sm text-muted-foreground">
                Escolha o tipo principal praticado na quadra
              </p>
              <RadioGroup defaultValue="futebol7" name="esporte" className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                {[
                  { value: 'futebol7', label: 'Futebol 7' },
                  { value: 'salao', label: 'Salão' },
                  { value: 'volei', label: 'Vôlei' },
                  { value: 'basquete', label: 'Basquete' },
                  { value: 'tenis', label: 'Tênis' },
                  { value: 'beach_tenis', label: 'Beach Tênis' },
                ].map((s) => (
                  <div key={s.value} className="flex items-center space-x-2">
                    <RadioGroupItem id={s.value} value={s.value} />
                    <Label htmlFor={s.value} className="cursor-pointer">{s.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* Nome da Quadra */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Quadra *</Label>
                <Input id="nome" name="nome" placeholder="Ex: Arena Central" required />
              </div>
              <div className="space-y-2">
                <Label>Preço por Hora (R$) *</Label>
                <Input name="preco_hora" type="number" min="0" step="0.01" placeholder="120" required />
              </div>
            </section>

            {/* Proprietário (somente leitura visual, NÃO envia para o server) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input value={owner.nome ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input value={owner.telefone ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input value={owner.email ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>CPF/CNPJ *</Label>
                <Input value={owner.cpf_cnpj ?? ''} disabled />
              </div>
            </section>

            {/* Descrição */}
            <section className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea id="descricao" name="descricao" placeholder="Descreva sua quadra, suas características e diferenciais..." rows={4} required />
            </section>

            {/* Localização */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rua">Endereço (Rua) *</Label>
                  <Input id="rua" name="rua" placeholder="Rua" ref={ruaRef} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" name="numero" placeholder="123" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" name="bairro" placeholder="Bairro" ref={bairroRef} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" name="cidade" placeholder="Ex: Caxias do Sul" ref={cidadeRef} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input id="cep" name="cep" placeholder="00000-000" onBlur={handleCepBlur} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">Estado *</Label>
                  <Select
                    onValueChange={(uf) => { if (ufRef.current) ufRef.current.value = uf.toUpperCase() }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
                        'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
                      ].map((uf) => (<SelectItem key={uf} value={uf}>{uf}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {/* Campo que realmente envia o UF */}
                  <input type="hidden" name="uf" ref={ufRef} />
                </div>
              </div>
            </section>

            {/* Comodidades */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Comodidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Estacionamento','Vestiário','Chuveiro','Iluminação','Cobertura',
                  'Lanchonete','Wi-Fi','Segurança','Arquibancada',
                ].map((c) => {
                  const id = c.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox id={id} name="comodidades" value={c.toLowerCase()} />
                      <Label htmlFor={id}>{c}</Label>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Upload de Fotos */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Fotos da Quadra
              </h3>

              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Clique para fazer upload ou arraste as fotos aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG/JPG/WEBP até 10MB cada (máximo 10 fotos)
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  name="imagens"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilesSelected(e.currentTarget.files)}
                />
                <Button type="button" variant="outline" className="mt-4 bg-transparent" onClick={() => fileRef.current?.click()}>
                  Selecionar Fotos
                </Button>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {previews.map((p, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-lg border">
                      <img src={p.url} alt={`preview-${idx}`} className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreview(idx)}
                        className="absolute right-1 top-1 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Termos (visual) */}
            <section className="flex items-center gap-2">
              <Checkbox id="termos" />
              <Label htmlFor="termos" className="text-sm">
                Aceito os{' '}
                <Link href="#" className="text-primary hover:underline">termos de uso</Link>{' '}e{' '}
                <Link href="#" className="text-primary hover:underline">política de privacidade</Link>
              </Label>
            </section>

            {/* Ações */}
            <div className="flex gap-4 pt-2">
              <SubmitButton>Cadastrar Quadra</SubmitButton>
              <Button type="button" variant="outline" onClick={() => history.back()}>
                Cancelar
              </Button>
              <PendingOverlay />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
