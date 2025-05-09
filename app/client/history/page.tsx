"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientLayout } from "@/components/client-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronDown, Clock, Filter, Scissors, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ClientHistoryItem } from "@/components/client-history-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Dados simulados
const historyData = [
  {
    id: 1,
    date: "15/05/2025",
    time: "14:30",
    barber: "Deco Barbeiro",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    rating: 5,
    status: "completed",
  },
  {
    id: 2,
    date: "28/04/2025",
    time: "10:15",
    barber: "Deco Barbeiro",
    service: "Corte + Barba",
    price: "R$ 55,00",
    rating: 4,
    status: "completed",
  },
  {
    id: 3,
    date: "10/04/2025",
    time: "16:45",
    barber: "Deco Barbeiro",
    service: "Barba",
    price: "R$ 25,00",
    rating: 5,
    status: "completed",
  },
  {
    id: 4,
    date: "22/03/2025",
    time: "11:30",
    barber: "Deco Barbeiro",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    rating: 4,
    status: "completed",
  },
  {
    id: 5,
    date: "05/03/2025",
    time: "15:00",
    barber: "Deco Barbeiro",
    service: "Corte + Barba",
    price: "R$ 55,00",
    rating: 5,
    status: "completed",
  },
  {
    id: 6,
    date: "18/02/2025",
    time: "09:45",
    barber: "Deco Barbeiro",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    rating: 3,
    status: "completed",
  },
]

export default function ClientHistoryPage() {
  const [period, setPeriod] = useState("all")
  const [filteredData, setFilteredData] = useState(historyData)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Estatísticas
  const totalVisits = historyData.length
  const favoriteService = "Corte de cabelo"
  const averageRating = (historyData.reduce((sum, item) => sum + item.rating, 0) / historyData.length).toFixed(1)

  const handleFilterChange = (value: string) => {
    setPeriod(value)

    // Simulação de filtro
    if (value === "month") {
      setFilteredData(historyData.slice(0, 3))
    } else if (value === "3months") {
      setFilteredData(historyData.slice(0, 5))
    } else {
      setFilteredData(historyData)
    }
  }

  return (
    <ClientLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Histórico</h1>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-zinc-900 border-zinc-800">
              <div className="space-y-4">
                <h4 className="font-medium">Período</h4>
                <Select value={period} onValueChange={handleFilterChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                    <SelectItem value="3months">Últimos 3 meses</SelectItem>
                    <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  </SelectContent>
                </Select>

                <h4 className="font-medium">Serviço</h4>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="haircut">Corte de cabelo</SelectItem>
                    <SelectItem value="beard">Barba</SelectItem>
                    <SelectItem value="combo">Corte + Barba</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => setIsFilterOpen(false)}>
                  Aplicar filtros
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 w-full">
            <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-zinc-800">
              Histórico
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-zinc-800">
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4 space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => <ClientHistoryItem key={item.id} item={item} />)
            ) : (
              <div className="text-center py-10 text-zinc-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum atendimento encontrado</p>
                <p className="text-sm">Tente ajustar os filtros</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Total de Visitas</p>
                      <p className="text-3xl font-bold">{totalVisits}</p>
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
                      <p className="text-sm text-zinc-400">Serviço Favorito</p>
                      <p className="text-xl font-bold">{favoriteService}</p>
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
                      <p className="text-sm text-zinc-400">Avaliação Média</p>
                      <div className="flex items-center">
                        <p className="text-3xl font-bold mr-2">{averageRating}</p>
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Star className="h-6 w-6 text-zinc-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Serviços Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="bg-red-600 mr-2">60%</Badge>
                      <span>Corte de cabelo</span>
                    </div>
                    <span className="text-zinc-400">3 vezes</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="bg-zinc-700 mr-2">30%</Badge>
                      <span>Corte + Barba</span>
                    </div>
                    <span className="text-zinc-400">2 vezes</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="bg-zinc-700 mr-2">10%</Badge>
                      <span>Barba</span>
                    </div>
                    <span className="text-zinc-400">1 vez</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  )
}
