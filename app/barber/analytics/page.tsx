"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { BarberLayout } from "@/components/barber-layout"
import { CalendarDays, Clock, Scissors, TrendingUp, Users } from "lucide-react"

// Dados simulados
const weeklyData = [
  { day: "Segunda", clientes: 12, tempoMedio: 25 },
  { day: "Terça", clientes: 8, tempoMedio: 30 },
  { day: "Quarta", clientes: 15, tempoMedio: 22 },
  { day: "Quinta", clientes: 10, tempoMedio: 28 },
  { day: "Sexta", clientes: 18, tempoMedio: 20 },
  { day: "Sábado", clientes: 20, tempoMedio: 18 },
  { day: "Domingo", clientes: 0, tempoMedio: 0 },
]

const monthlyData = [
  { month: "Jan", clientes: 180, tempoMedio: 25 },
  { month: "Fev", clientes: 200, tempoMedio: 24 },
  { month: "Mar", clientes: 220, tempoMedio: 22 },
  { month: "Abr", clientes: 190, tempoMedio: 26 },
  { month: "Mai", clientes: 240, tempoMedio: 20 },
  { month: "Jun", clientes: 230, tempoMedio: 21 },
]

export default function BarberAnalyticsPage() {
  return (
    <BarberLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Estatísticas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total de Clientes</p>
                  <p className="text-3xl font-bold">83</p>
                  <p className="text-xs text-green-500">+12% este mês</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Users className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Tempo Médio</p>
                  <p className="text-3xl font-bold">24 min</p>
                  <p className="text-xs text-green-500">-2 min que semana passada</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Cortes por Dia</p>
                  <p className="text-3xl font-bold">13.8</p>
                  <p className="text-xs text-green-500">+2.3 que mês passado</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Scissors className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Dias Trabalhados</p>
                  <p className="text-3xl font-bold">22</p>
                  <p className="text-xs text-red-500">-1 que mês passado</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="week" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="week" className="data-[state=active]:bg-zinc-800">
              Esta Semana
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-zinc-800">
              Este Mês
            </TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-zinc-800">
              Este Ano
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Clientes por Dia
                </CardTitle>
                <CardDescription>Número de clientes atendidos por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      clientes: {
                        label: "Clientes",
                        color: "hsl(var(--chart-1))",
                      },
                      tempoMedio: {
                        label: "Tempo Médio (min)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="clientes" fill="var(--color-clientes)" radius={4} />
                        <Bar dataKey="tempoMedio" fill="var(--color-tempoMedio)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Clientes por Mês
                </CardTitle>
                <CardDescription>Número de clientes atendidos por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      clientes: {
                        label: "Clientes",
                        color: "hsl(var(--chart-1))",
                      },
                      tempoMedio: {
                        label: "Tempo Médio (min)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="clientes" fill="var(--color-clientes)" radius={4} />
                        <Bar dataKey="tempoMedio" fill="var(--color-tempoMedio)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="year">
            <div className="flex items-center justify-center h-80 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-zinc-500">Dados anuais em breve disponíveis</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BarberLayout>
  )
}
