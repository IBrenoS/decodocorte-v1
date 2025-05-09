"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, LogOut, Save, User } from "lucide-react"
import { ClientLayout } from "@/components/client-layout"

export default function ProfilePage() {
  const [name, setName] = useState("Rafael Mendes")
  const [email, setEmail] = useState("rafael.mendes@example.com")
  const [notifications, setNotifications] = useState(true)

  return (
    <ClientLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Perfil</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-2 border-zinc-700">
              <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt="Foto de perfil" />
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-red-600 hover:bg-red-700">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-medium">{name}</h2>
          <p className="text-zinc-400">{email}</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
              Alterar senha
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como deseja ser notificado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por email</p>
                <p className="text-sm text-zinc-400">Receba alertas quando estiver próximo na fila</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-red-600 hover:bg-red-700">
          <Save className="mr-2 h-4 w-4" />
          Salvar alterações
        </Button>

        <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
          <LogOut className="mr-2 h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </ClientLayout>
  )
}
