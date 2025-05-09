import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type BarberHistoryItemProps = {
  item: {
    id: number
    date: string
    time: string
    client: string
    phone: string
    service: string
    price: string
    duration: string
    rating: number
  }
}

export function BarberHistoryItem({ item }: BarberHistoryItemProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10 border border-zinc-700">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={item.client} />
              <AvatarFallback className="bg-zinc-800 text-zinc-400">{item.client.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{item.client}</h3>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < item.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-400">{item.phone}</p>
              <div className="flex items-center mt-1 text-sm">
                <Clock className="h-3 w-3 mr-1 text-zinc-500" />
                <span className="text-zinc-500">{item.time}</span>
                <span className="mx-2 text-zinc-700">•</span>
                <span>{item.service}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <Badge className="bg-zinc-800 text-zinc-300">{item.price}</Badge>
            <span className="text-xs text-zinc-500">{item.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
