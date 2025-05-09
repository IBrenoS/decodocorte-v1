"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, UserX } from "lucide-react";

import { QueueClient } from "@/lib/barber";

type BarberQueueItemProps = {
  client: QueueClient;
  onComplete: () => void;
  onRemove: () => void;
};

export function BarberQueueItem({
  client,
  onComplete,
  onRemove,
}: BarberQueueItemProps) {
  // Determinamos se o cliente está sendo atendido (posição 1)
  const isInProgress = client.position === 1;

  return (
    <Card
      className={`bg-zinc-800 border-zinc-700 ${
        isInProgress ? "border-l-4 border-l-red-600" : ""
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-zinc-600">
              <AvatarImage
                src={
                  client.profileImage || `/placeholder.svg?height=40&width=40`
                }
                alt={client.name}
              />
              <AvatarFallback className="bg-zinc-700 text-zinc-300">
                {client.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="font-medium">{client.name}</p>
                {isInProgress && (
                  <Badge className="ml-2 bg-red-600 hover:bg-red-600">
                    Em atendimento
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-zinc-400">
                <span className="mr-3">Posição {client.position}</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  Entrou às{" "}
                  {new Date(client.joinedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={onComplete}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-zinc-600 hover:bg-zinc-700"
              onClick={onRemove}
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
