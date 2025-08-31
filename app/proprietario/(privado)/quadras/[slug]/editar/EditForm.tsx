'use client'

import * as React from 'react'
import { updateQuadra } from './actions'
import { PendingOverlay } from '@/components/form/PendingOverlay'
import { SubmitButton } from '@/components/form/SubmitButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Props = {
  slug: string
  initial: {
    nome: string
    esporte: string
    preco_hora: number
    descricao: string
    endereco: { cep?: string; rua?: string; numero?: string; bairro?: string; cidade?: string; uf?: string }
    comodidades: string[]
  }
}

export default function EditForm({ slug, initial }: Props) {
  const ruaRef = React.useRef<HTMLInputElement | null>(null)
  const bairroRef = React.useRef<HTMLInputElement | null>(null)
  const cidadeRef = React.useRef<HTMLInputElement | null>(null)
  const ufRef = React.useRef<HTMLInputElement | null>(null)

  async function onCepBlur(e: React.FocusEvent<HTMLInputElement>) {
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
    } catch { /* noop */ }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Quadra</CardTitle>
          <CardDescription>Atualize as informações da sua quadra</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateQuadra.bind(null, slug)} className="space-y-8">
            {/* Esporte */}
            <section className="space-y-3">
              <Label className="text-base font-semibold">Tipo de Esporte *</Label>
              <RadioGroup name="esporte" defaultValue={
                // normaliza para os valores do form
                initial.esporte === 'futebol' ? 'futebol7'
                : initial.esporte === 'beach_tennis' ? 'beach_tenis'
                : initial.esporte
              } className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                {[
                  { value: 'futebol7', label: 'Futebol 7' },
                  { value: 'salao', label: 'Salão' },
                  { value: 'volei', label: 'Vôlei' },
                  { value: 'basquete', label: 'Basquete' },
                  { value: 'tenis', label: 'Tênis' },
                  { value: 'beach_tenis', label: 'Beach Tênis' },
                ].map((s) => (
                  <label key={s.value} className="flex items-center gap-2">
                    <RadioGroupItem id={s.value} value={s.value} />
                    <span>{s.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </section>

            {/* Nome / Preço */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Quadra *</Label>
                <Input id="nome" name="nome" defaultValue={initial.nome} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco_hora">Preço por Hora (R$) *</Label>
                <Input id="preco_hora" name="preco_hora" type="number" min="0" step="0.01" defaultValue={initial.preco_hora} required />
              </div>
            </section>

            {/* Descrição */}
            <section className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea id="descricao" name="descricao" rows={4} defaultValue={initial.descricao} required />
            </section>

            {/* Endereço */}
            <section className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input id="cep" name="cep" defaultValue={initial.endereco.cep ?? ''} onBlur={onCepBlur} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">Estado *</Label>
                  <Input id="uf" name="uf" defaultValue={initial.endereco.uf ?? ''} ref={ufRef} maxLength={2} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input id="rua" name="rua" defaultValue={initial.endereco.rua ?? ''} ref={ruaRef} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" name="numero" defaultValue={initial.endereco.numero ?? ''} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" name="bairro" defaultValue={initial.endereco.bairro ?? ''} ref={bairroRef} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" name="cidade" defaultValue={initial.endereco.cidade ?? ''} ref={cidadeRef} required />
                </div>
              </div>
            </section>

            {/* Comodidades */}
            <section className="space-y-3">
              <Label className="text-base font-semibold">Comodidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Estacionamento','Vestiário','Chuveiro','Iluminação','Cobertura',
                  'Lanchonete','Wi-Fi','Segurança','Arquibancada',
                ].map((c) => {
                  const val = c.toLowerCase()
                  const checked = initial.comodidades?.includes(val)
                  const id = `comod-${val.replace(/\s+/g,'-')}`
                  return (
                    <label key={id} className="flex items-center gap-2">
                      <input type="checkbox" id={id} name="comodidades" value={val} defaultChecked={checked} />
                      <span>{c}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            <div className="flex gap-3 pt-2">
              <SubmitButton>Salvar alterações</SubmitButton>
              <PendingOverlay />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
