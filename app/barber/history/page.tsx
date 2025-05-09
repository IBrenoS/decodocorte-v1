"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarberLayout } from "@/components/barber-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, ChevronDown, Download, Filter, Search, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BarberHistoryItem } from "@/components/barber-history-item"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Dados simulados
const historyData = [
  {
    id: 1,
    date: "15/05/2025",
    time: "14:30",
    client: "Rafael Mendes",
    phone: "(11) 98765-4321",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    duration: "30 min",
    rating: 5,
  },
  {
    id: 2,
    date: "15/05/2025",
    time: "13:00",
    client: "Carlos Oliveira",
    phone: "(11) 91234-5678",
    service: "Corte + Barba",
    price: "R$ 55,00",
    duration: "45 min",
    rating: 4,
  },
  {
    id: 3,
    date: "14/05/2025",
    time: "16:45",
    client: "Pedro Santos",
    phone: "(11) 99876-5432",
    service: "Barba",
    price: "R$ 25,00",
    duration: "20 min",
    rating: 5,
  },
  {
    id: 4,
    date: "14/05/2025",
    time: "11:30",
    client: "André Souza",
    phone: "(11) 98765-1234",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    duration: "30 min",
    rating: 4,
  },
  {
    id: 5,
    date: "13/05/2025",
    time: "15:00",
    client: "Marcos Pereira",
    phone: "(11) 95678-1234",
    service: "Corte + Barba",
    price: "R$ 55,00",
    duration: "45 min",
    rating: 5,
  },
  {
    id: 6,
    date: "13/05/2025",
    time: "09:45",
    client: "Ricardo Almeida",
    phone: "(11) 97654-3210",
    service: "Corte de cabelo",
    price: "R$ 35,00",
    duration: "30 min",
    rating: 3,
  },
]

export default function BarberHistoryPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState(historyData)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Estatísticas
  const totalClients = historyData.length
  const uniqueClients = new Set(historyData.map((item) => item.client)).size
  const averageRating = (historyData.reduce((sum, item) => sum + item.rating, 0) / historyData.length).toFixed(1)
  const totalRevenue = historyData
    .reduce((sum, item) => sum + Number.parseInt(item.price.replace(/\D/g, "")) / 100, 0)
    .toFixed(2)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query) {
      setFilteredData(
        historyData.filter(
          (item) =>
            item.client.toLowerCase().includes(query) ||
            item.service.toLowerCase().includes(query) ||
            item.phone.includes(query),
        ),
      )
    } else {
      setFilteredData(historyData)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)

    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy")
      setFilteredData(historyData.filter((item) => item.date === formattedDate))
    } else {
      setFilteredData(historyData)
    }

    setIsFilterOpen(false)
  }

  const handleExport = () => {
    alert("Exportando dados para CSV...")
    // Aqui seria implementada a funcionalidade de exportação
  }

  return (
    <BarberLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Histórico de Atendimentos</h1>

          <div className="flex space-x-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  <Filter className="h-4 w-4 mr-2" />
                  {date ? format(date, "dd/MM/yyyy") : "Filtrar por data"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="bg-zinc-900"
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por cliente, serviço ou telefone..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={handleSearch}
          />
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
              <>
                {/* Agrupamento por data */}
                {Array.from(new Set(filteredData.map((item) => item.date))).map((date) => (
                  <div key={date} className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-400 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date}
                    </h3>

                    {filteredData
                      .filter((item) => item.date === date)
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((item) => (
                        <BarberHistoryItem key={item.id} item={item} />
                      ))}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-10 text-zinc-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum atendimento encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou a busca</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Total de Atendimentos</p>
                      <p className="text-3xl font-bold">{totalClients}</p>
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
                      <p className="text-sm text-zinc-400">Clientes Únicos</p>
                      <p className="text-3xl font-bold">{uniqueClients}</p>
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

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Faturamento</p>
                      <p className="text-3xl font-bold">R$ {totalRevenue}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-lg font-bold text-zinc-400">R$</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg">Serviços Realizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-red-600 mr-2">50%</Badge>
                        <span>Corte de cabelo</span>
                      </div>
                      <span className="text-zinc-400">3 vezes</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-zinc-700 mr-2">33%</Badge>
                        <span>Corte + Barba</span>
                      </div>
                      <span className="text-zinc-400">2 vezes</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-zinc-700 mr-2">17%</Badge>
                        <span>Barba</span>
                      </div>
                      <span className="text-zinc-400">1 vez</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg">Clientes Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Rafael Mendes</span>
                      <Badge>1 visita</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Carlos Oliveira</span>
                      <Badge>1 visita</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Pedro Santos</span>
                      <Badge>1 visita</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>André Souza</span>
                      <Badge>1 visita</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BarberLayout>
  )
}
