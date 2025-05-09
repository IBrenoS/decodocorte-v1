"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, registerUser, UserType, verifyCode } from "@/lib/auth";
import { ArrowLeft, Loader2, Scissors } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "client") as UserType;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    // Validação básica de email
    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor, insira um email válido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Em um cenário real, aqui poderia ser feita uma verificação
      // se o email já existe antes de prosseguir
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar código");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password, type });

      // O login já salvou o token e dados do usuário
      console.log("Login bem-sucedido:", response.user.name);

      if (type === "barber") {
        router.push("/barber/dashboard");
      } else {
        router.push("/client/queue");
      }
    } catch (err: any) {
      // Usar o friendlyMessage se disponível
      const errorMsg =
        err.friendlyMessage ||
        err.message ||
        "Falha ao realizar login. Verifique suas credenciais.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerUser({ name, email, password, type });
      setStep(2); // Avança para verificação
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("Por favor, insira o código de verificação");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyCode(email, verificationCode);

      // Após verificação bem-sucedida, fazer login
      await login({ email, password, type });

      if (type === "barber") {
        router.push("/barber/dashboard");
      } else {
        router.push("/client/queue");
      }
    } catch (err: any) {
      setError(err.message || "Código de verificação inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-8 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center">
            <Scissors className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {type === "barber" ? "Login de Barbeiro" : "Login de Cliente"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-white rounded-md text-sm w-full max-w-xs">
            {error}
          </div>
        )}

        <div className="w-full max-w-xs">
          {step === 1 && !isNewUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleLogin}
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-zinc-400"
                  onClick={() => setIsNewUser(true)}
                >
                  Não tem uma conta? Cadastre-se
                </Button>
              </div>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-zinc-400"
                  onClick={() => setStep(3)}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </div>
          )}

          {step === 1 && isNewUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleRegister}
                disabled={
                  loading || !name || !email || !password || !confirmPassword
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-zinc-400"
                  onClick={() => setIsNewUser(false)}
                >
                  Já tem uma conta? Faça login
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificação</Label>
                <p className="text-sm text-zinc-400">
                  Enviamos um código para {email}
                </p>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleVerifyCode}
                disabled={verificationCode.length < 4}
              >
                Verificar
              </Button>
              <Button
                variant="link"
                className="w-full text-zinc-400"
                onClick={() => setStep(1)}
              >
                Voltar e corrigir email
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email para recuperação</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleSendCode}
                disabled={!email.includes("@")}
              >
                Enviar link de recuperação
              </Button>
              <Button
                variant="link"
                className="w-full text-zinc-400"
                onClick={() => setStep(1)}
              >
                Voltar para o login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
