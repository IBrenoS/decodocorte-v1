import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star } from "lucide-react"

type ClientHistoryItemProps = {
  item: {
    id: number
    date: string
    time: string
    barber: string
    service: string
    price: string
    rating: number
    status: string
  }
}

export function ClientHistoryItem({ item }: ClientHistoryItemProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.service}</h3>
              <p className="text-sm text-zinc-400">{item.barber}</p>
            </div>
            <Badge className="bg-zinc-800 text-zinc-300">{item.price}</Badge>
          </div>

          <div className="flex items-center text-sm text-zinc-400 space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{item.time}</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < item.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-zinc-500">Sua avaliação</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
