"use client";

import { BarberLayout } from "@/components/barber-layout";
import { BarberQueueItem } from "@/components/barber-queue-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useBarberQueue } from "@/hooks/use-queue";
import {
  callNextClient,
  closeBarberQueue,
  completeClientService,
  getBarberQueue,
  getBarberQueueStatus,
  openBarberQueue,
  QueueClient,
  QueueStatus,
  removeClientFromQueue,
} from "@/lib/barber";
import { Check, Clock, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

type CompletedClient = {
  id: string;
  name: string;
  profileImage?: string;
  completedAt: string;
};

export default function BarberDashboardPage() {
  const { requireAuth } = useAuth();
  const { loading: authLoading } = requireAuth("barber");

  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [queue, setQueue] = useState<QueueClient[]>([]);
  const [completed, setCompleted] = useState<CompletedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar hook para obter atualizações em tempo real da fila
  const {
    queue: realtimeQueue,
    isQueueOpen,
    loading: socketLoading,
    error: socketError,
  } = useBarberQueue(queue);

  // Atualizar fila quando houver mudanças em tempo real
  useEffect(() => {
    if (realtimeQueue && realtimeQueue.length > 0) {
      setQueue(realtimeQueue);
    }

    if (typeof isQueueOpen === "boolean" && queueStatus) {
      setQueueStatus({ ...queueStatus, isOpen: isQueueOpen });
    }
  }, [realtimeQueue, isQueueOpen, queueStatus]);

  // Carregar dados iniciais
  useEffect(() => {
    if (authLoading) return;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carregar status da fila
        const statusData = await getBarberQueueStatus();
        setQueueStatus(statusData);

        // Carregar clientes na fila
        const queueData = await getBarberQueue();
        setQueue(queueData);

        // Em um cenário real, carregaríamos também clientes recentemente atendidos
        // Por enquanto, vamos manter um array vazio
        setCompleted([]);
      } catch (err: any) {
        setError(
          "Erro ao carregar dados: " +
            (err.message || "Tente novamente mais tarde")
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading]);

  const handleToggleQueue = async () => {
    if (!queueStatus) return;

    setActionLoading(true);
    setError(null);

    try {
      const newStatus = queueStatus.isOpen
        ? await closeBarberQueue()
        : await openBarberQueue();

      setQueueStatus(newStatus);
    } catch (err: any) {
      setError(
        `Erro ao ${queueStatus.isOpen ? "fechar" : "abrir"} fila: ${
          err.message || "Tente novamente"
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleNextClient = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await callNextClient();
      // A atualização da fila virá através do Socket.IO
    } catch (err: any) {
      setError(
        "Erro ao chamar próximo cliente: " + (err.message || "Tente novamente")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteClient = async (clientId: string) => {
    setActionLoading(true);
    setError(null);

    try {
      await completeClientService(clientId);

      // Mover o cliente para a lista de completados
      const completedClient = queue.find((c) => c.id === clientId);
      if (completedClient) {
        // Remove da fila e adiciona aos completados
        setQueue(queue.filter((c) => c.id !== clientId));
        setCompleted([
          {
            id: completedClient.id,
            name: completedClient.name,
            profileImage: completedClient.profileImage,
            completedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...completed,
        ]);
      }
    } catch (err: any) {
      setError(
        "Erro ao completar atendimento: " + (err.message || "Tente novamente")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveClient = async (clientId: string) => {
    setActionLoading(true);
    setError(null);

    try {
      await removeClientFromQueue(clientId);
      // A fila será atualizada automaticamente via Socket.IO, mas vamos atualizar também localmente
      setQueue(queue.filter((c) => c.id !== clientId));
    } catch (err: any) {
      setError(
        "Erro ao remover cliente: " + (err.message || "Tente novamente")
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <BarberLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciamento da Fila</h1>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {loading ? (
            <Button variant="outline" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Carregando...
            </Button>
          ) : (
            <Button
              variant={queueStatus?.isOpen ? "destructive" : "outline"}
              onClick={handleToggleQueue}
              disabled={actionLoading || !queueStatus}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {queueStatus?.isOpen ? "Fechar Fila" : "Abrir Fila"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Fila de Espera
                </CardTitle>
                <Badge>{queue.length} clientes</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {queue.length > 0 ? (
                <div className="space-y-3">
                  {queue.map((client) => (
                    <BarberQueueItem
                      key={client.id}
                      client={client}
                      onComplete={() => handleCompleteClient(client.id)}
                      onRemove={() => handleRemoveClient(client.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>Nenhum cliente na fila</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Atendimentos Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completed.length > 0 ? (
                <div className="space-y-3">
                  {completed.map((client) => (
                    <Card
                      key={client.id}
                      className="bg-zinc-800 border-zinc-700"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 border border-zinc-600">
                            <AvatarImage
                              src={
                                client.profileImage ||
                                `/placeholder.svg?height=32&width=32`
                              }
                              alt={client.name}
                            />
                            <AvatarFallback className="bg-zinc-700 text-zinc-300">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">{client.name}</p>
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{client.completedAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>Nenhum atendimento concluído hoje</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BarberLayout>
  );
}
