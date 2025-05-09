import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

type QueueItemProps = {
  client: {
    id: number
    name: string
    position: number
    status: string
    estimatedTime: string
  }
}

export function QueueItem({ client }: QueueItemProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-zinc-700">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={client.name} />
              <AvatarFallback className="bg-zinc-800 text-zinc-400">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{client.name}</p>
              <div className="flex items-center text-xs text-zinc-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{client.estimatedTime}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={client.status === "in-progress" ? "default" : "outline"}
            className={client.status === "in-progress" ? "bg-red-600 hover:bg-red-600" : ""}
          >
            {client.position}º
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
