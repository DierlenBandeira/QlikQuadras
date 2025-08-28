"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Loader2 } from "lucide-react";

import { createSupabaseBrowser } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function PerfilPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [isLogin, setIsLogin] = useState(true);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [busyLogin, setBusyLogin] = useState(false);

  // cadastro
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [busyReg, setBusyReg] = useState(false);

  // mensagens
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusyLogin(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPass,
    });
    setBusyLogin(false);
    if (error) return setErr(error.message);
    router.push("/"); // destino pós-login
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (regPass.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (regPass !== regConfirm) return setErr("As senhas não conferem.");

    setBusyReg(true);
    const { data, error } = await supabase.auth.signUp({
      email: regEmail.trim(),
      password: regPass,
      options: {
        data: { full_name: fullName, phone, city }, // fica em user.user_metadata
        emailRedirectTo: `${location.origin}`,       // se confirmar e-mail estiver ON
      },
    });
    setBusyReg(false);

    if (error) return setErr(error.message);

    // Se confirmação de e-mail estiver habilitada, não há session ainda:
    if (!data.session) {
      setMsg("Enviamos um e-mail de confirmação. Verifique sua caixa de entrada.");
    } else {
      router.push("/"); // já logado quando confirmação está desativada
    }
  }

  async function handleResetPassword() {
    setErr(null); setMsg(null);
    const targetEmail = isLogin ? loginEmail.trim() : regEmail.trim();
    if (!targetEmail) return setErr("Digite seu e-mail primeiro.");
    const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: `${location.origin}/perfil`, // volta pra cá após reset
    });
    if (error) setErr(error.message);
    else setMsg("Enviamos um link de recuperação para o seu e-mail.");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            <h1 className="text-xl font-semibold">Minha Conta</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bem-vindo ao Clik Quadras</CardTitle>
              <CardDescription>
                {isLogin ? "Entre na sua conta para continuar" : "Crie sua conta para começar"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* mensagens globais */}
              {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
              {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}

              <Tabs value={isLogin ? "login" : "cadastro"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="cadastro" onClick={() => setIsLogin(false)}>
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full" size="lg" type="submit" disabled={busyLogin}>
                      {busyLogin ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button variant="link" className="text-sm" onClick={handleResetPassword}>
                      Esqueceu sua senha?
                    </Button>
                  </div>
                </TabsContent>

                {/* CADASTRO */}
                <TabsContent value="cadastro" className="space-y-4 mt-6">
                  <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          className="pl-10"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-cadastro">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-cadastro"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cidade"
                          type="text"
                          placeholder="Sua cidade"
                          className="pl-10"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-cadastro">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password-cadastro"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={regPass}
                          onChange={(e) => setRegPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full" size="lg" type="submit" disabled={busyReg}>
                      {busyReg ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Ao continuar, você concorda com nossos{" "}
                <Button variant="link" className="p-0 h-auto text-sm">Termos de Uso</Button>{" "}
                e{" "}
                <Button variant="link" className="p-0 h-auto text-sm">Política de Privacidade</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
