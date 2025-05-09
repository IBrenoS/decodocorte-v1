"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, LogOut, Save, User } from "lucide-react"
import { BarberLayout } from "@/components/barber-layout"

export default function BarberSettingsPage() {
  const [name, setName] = useState("Deco Barbeiro")
  const [email, setEmail] = useState("deco.barbeiro@example.com")
  const [maxClients, setMaxClients] = useState(15)
  const [autoClose, setAutoClose] = useState(true)
  const [workDays, setWorkDays] = useState("1,2,3,4,5")

  return (
    <BarberLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Configurações</h1>

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
            <CardTitle>Informações da Barbearia</CardTitle>
            <CardDescription>Atualize seus dados profissionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do barbeiro</Label>
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
            <div className="space-y-2">
              <Label htmlFor="workdays">Dias de trabalho</Label>
              <Select defaultValue={workDays}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Selecione os dias" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="1,2,3,4,5">Segunda a Sexta</SelectItem>
                  <SelectItem value="1,2,3,4,5,6">Segunda a Sábado</SelectItem>
                  <SelectItem value="2,3,4,5,6">Terça a Sábado</SelectItem>
                  <SelectItem value="1,3,5">Segunda, Quarta e Sexta</SelectItem>
                  <SelectItem value="2,4,6">Terça, Quinta e Sábado</SelectItem>
                </SelectContent>
              </Select>
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
            <CardTitle>Configurações da Fila</CardTitle>
            <CardDescription>Defina como a fila de espera deve funcionar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Limite máximo de clientes por dia: {maxClients}</Label>
              <Slider
                value={[maxClients]}
                min={5}
                max={30}
                step={1}
                onValueChange={(value) => setMaxClients(value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fechar fila automaticamente</p>
                <p className="text-sm text-zinc-400">Fechar a fila quando atingir o limite máximo</p>
              </div>
              <Switch checked={autoClose} onCheckedChange={setAutoClose} />
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
    </BarberLayout>
  )
}
