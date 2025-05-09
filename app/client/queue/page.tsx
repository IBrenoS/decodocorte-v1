"use client";

import { ClientLayout } from "@/components/client-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useClientQueuePosition } from "@/hooks/use-queue";
import {
  Barber,
  checkQueuePosition,
  ClientQueueInfo,
  getBarberDetails,
  joinBarberQueue,
  leaveBarberQueue,
} from "@/lib/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// No cenário atual, estamos usando um ID fixo para o barbeiro
// Em um app completo, o usuário escolheria qual barbeiro quer visitar
const BARBER_ID = "barber123"; // ID padrão para testes

export default function ClientQueuePage() {
  const { requireAuth } = useAuth();
  const { user, loading: authLoading } = requireAuth("client");

  const [barber, setBarber] = useState<Barber | null>(null);
  const [queueInfo, setQueueInfo] = useState<ClientQueueInfo | null>(null);
  const [queueClosed, setQueueClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  // Somente inicializar o hook de tempo real quando a autenticação for concluída
  // e tivermos certeza que o usuário está logado
  const {
    queueInfo: realtimeQueueInfo,
    isCalled,
    loading: socketLoading,
    error: socketError,
  } = useClientQueuePosition(
    // Só passar o ID do barbeiro quando o usuário estiver autenticado
    !authLoading && user ? BARBER_ID : "",
    queueInfo
  );

  // Atualizar quando informações em tempo real chegarem
  useEffect(() => {
    if (realtimeQueueInfo) {
      setQueueInfo(realtimeQueueInfo);
    }

    // Alerta quando for chamado
    if (isCalled && typeof window !== "undefined") {
      alert("É a sua vez! Dirija-se ao barbeiro.");
    }

    // Gerenciar erros do socket
    if (socketError && !error) {
      setError(socketError);
    }
  }, [realtimeQueueInfo, isCalled, socketError]);

  // Carregar dados iniciais
  useEffect(() => {
    if (authLoading) return;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carregar dados do barbeiro
        const barberData = await getBarberDetails(BARBER_ID);
        setBarber(barberData);

        // Verificar status da fila
        const queueStatus = barberData.queueStatus;
        setQueueClosed(!queueStatus.isOpen);

        // Verificar se o cliente já está na fila
        const position = await checkQueuePosition(BARBER_ID);
        if (position) {
          setQueueInfo(position);
        }
      } catch (err: any) {
        setError(
          "Erro ao carregar dados: " + (err.message || "Tente novamente")
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading]);

  const handleJoinQueue = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await joinBarberQueue(BARBER_ID);
      setQueueInfo(response);
    } catch (err: any) {
      setError("Erro ao entrar na fila: " + (err.message || "Tente novamente"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!queueInfo) return;

    setActionLoading(true);
    setError(null);

    try {
      await leaveBarberQueue(BARBER_ID);
      setQueueInfo(null);
    } catch (err: any) {
      setError("Erro ao sair da fila: " + (err.message || "Tente novamente"));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {barber ? `Fila: ${barber.name}` : "Fila do Barbeiro"}
          </h1>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {!loading && (
            <Badge
              variant={queueClosed ? "destructive" : "outline"}
              className="text-xs"
            >
              {queueClosed ? "Fila fechada" : "Fila aberta"}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : queueClosed ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center text-zinc-400">
              <p>A fila está fechada no momento.</p>
              <p className="mt-2">
                Por favor, volte mais tarde ou entre em contato com o barbeiro.
              </p>
            </CardContent>
          </Card>
        ) : queueInfo ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <Badge className="bg-red-600 hover:bg-red-600 text-white px-3 py-1">
                  Sua posição: {queueInfo.position}º
                </Badge>
                <p className="text-zinc-400">
                  {queueInfo.position === 1
                    ? "Você é o próximo!"
                    : `Aproximadamente ${queueInfo.estimatedWait} minutos de espera`}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveQueue}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saindo...
                    </>
                  ) : (
                    "Sair da fila"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-4">
                  {barber && (
                    <div className="text-center mb-2">
                      <h3 className="font-medium">{barber.name}</h3>
                      {barber.rating && (
                        <div className="text-sm text-zinc-400">
                          Avaliação: {barber.rating.toFixed(1)} ⭐
                        </div>
                      )}
                      {barber.queueStatus && (
                        <div className="text-sm text-zinc-400 mt-1">
                          {barber.queueStatus.clientsCount} clientes na fila •
                          Tempo de espera estimado:{" "}
                          {barber.queueStatus.estimatedWaitTime} min
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleJoinQueue}
                    disabled={actionLoading || queueClosed}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar na Fila"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
