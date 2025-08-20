"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Moon, Sun, Bell, Shield, Globe, CreditCard, User, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  })
  const [profile, setProfile] = useState({
    name: "Carlos Silva",
    email: "carlos@email.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
  })

  // Aplicar tema escuro/claro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleSaveProfile = () => {
    // Lógica para salvar perfil
    console.log("Perfil salvo:", profile)
  }

  const handleDeleteAccount = () => {
    // Lógica para deletar conta
    if (confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) {
      console.log("Conta deletada")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-secondary-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-secondary-800 dark:text-white">Configurações</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Perfil */}
        <Card className="livelo-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-800 dark:text-white">
              <User className="h-5 w-5 text-primary-500" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary-500 text-white text-xl font-bold">CS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-secondary-800 dark:text-white">{profile.name}</h3>
                <p className="text-secondary-600 dark:text-gray-400">{profile.email}</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent dark:border-gray-600">
                  Alterar Foto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-secondary-700 dark:text-gray-300">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-secondary-700 dark:text-gray-300">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-secondary-700 dark:text-gray-300">
                  Localização
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="livelo-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-800 dark:text-white">
              {darkMode ? <Moon className="h-5 w-5 text-primary-500" /> : <Sun className="h-5 w-5 text-primary-500" />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-secondary-700 dark:text-gray-300">Tema Escuro</Label>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Alterne entre tema claro e escuro</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
            <Separator className="dark:border-gray-700" />
            <div className="space-y-2">
              <Label className="text-secondary-700 dark:text-gray-300">Idioma</Label>
              <Select defaultValue="pt-br">
                <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="livelo-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-800 dark:text-white">
              <Bell className="h-5 w-5 text-primary-500" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-secondary-700 dark:text-gray-300">Notificações por Email</Label>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Receba atualizações sobre suas reservas</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
            <Separator className="dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-secondary-700 dark:text-gray-300">Notificações Push</Label>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Receba notificações no seu dispositivo</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
            <Separator className="dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-secondary-700 dark:text-gray-300">SMS</Label>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Receba confirmações por SMS</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
            <Separator className="dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-secondary-700 dark:text-gray-300">Marketing</Label>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Receba ofertas e promoções</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacidade e Segurança */}
        <Card className="livelo-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-800 dark:text-white">
              <Shield className="h-5 w-5 text-primary-500" />
              Privacidade e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent dark:border-gray-600">
              <Shield className="h-4 w-4 mr-2 text-primary-500" />
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent dark:border-gray-600">
              <Globe className="h-4 w-4 mr-2 text-primary-500" />
              Política de Privacidade
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent dark:border-gray-600">
              <CreditCard className="h-4 w-4 mr-2 text-primary-500" />
              Métodos de Pagamento
            </Button>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="livelo-card border-red-200 dark:bg-gray-800 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-secondary-700 dark:text-gray-300">Deletar Conta</Label>
              <p className="text-sm text-secondary-600 dark:text-gray-400">
                Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar Conta Permanentemente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
