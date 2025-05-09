import { QueueClient } from "@/lib/barber";
import { ClientQueueInfo } from "@/lib/client";
import { getSocket, initSocket } from "@/lib/socket";
import { useEffect, useState } from "react";

/**
 * Hook para barbeiros monitorarem a fila em tempo real
 */
export function useBarberQueue(initialQueue: QueueClient[] = []) {
  const [queue, setQueue] = useState<QueueClient[]>(initialQueue);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const socket = getSocket();

      // Escutar atualizações da fila
      socket.on("queueUpdate", (data: { queue: QueueClient[], isOpen: boolean }) => {
        setQueue(data.queue);
        setIsQueueOpen(data.isOpen);
        setLoading(false);
      });

      // Escutar mudanças no status da fila
      socket.on("queueStatusChange", (data: { isOpen: boolean }) => {
        setIsQueueOpen(data.isOpen);
      });

      // Limpar eventos ao desmontar
      return () => {
        socket.off("queueUpdate");
        socket.off("queueStatusChange");
      };
    } catch (err) {
      setError("Erro ao conectar com o servidor de tempo real");
      setLoading(false);
    }
  }, []);

  return {
    queue,
    isQueueOpen,
    loading,
    error
  };
}

/**
 * Hook para clientes monitorarem sua posição na fila em tempo real
 */
export function useClientQueuePosition(barberId: string, initialPosition?: ClientQueueInfo | null) {
  const [queueInfo, setQueueInfo] = useState<ClientQueueInfo | null>(initialPosition || null);
  const [isCalled, setIsCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSocket, setHasSocket] = useState(false);

  useEffect(() => {
    // Não fazer nada se não houver ID de barbeiro
    if (!barberId) return;

    // Verificar se o usuário está autenticado e tem token
    const isAuth = typeof window !== 'undefined' && !!localStorage.getItem("token");

    if (!isAuth) {
      setError("Autenticação necessária para monitorar a fila");
      setLoading(false);
      return;
    }

    let socket: any = null;
    let socketInitialized = false;

    // Tentar inicializar o socket
    try {
      // Obter o token de autenticação
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token de autenticação não encontrado");
        setLoading(false);
        return;
      }

      try {
        // Tenta usar o socket existente ou inicializar um novo
        try {
          socket = getSocket();
          socketInitialized = true;
        } catch (e) {
          // Se falhou ao obter socket, tenta inicializar com o token
          socket = initSocket(token);
          socketInitialized = true;
        }

        setHasSocket(true);

        // Entrar na sala específica do barbeiro
        socket.emit("joinBarberRoom", barberId);

        // Escutar atualizações de posição
        socket.on("positionUpdate", (data: ClientQueueInfo) => {
          setQueueInfo(data);
          setLoading(false);
        });

        // Escutar quando for chamado
        socket.on("clientCalled", (data: { clientId: string }) => {
          setIsCalled(true);
        });

        // Escutar mudanças no status da fila
        socket.on("queueStatusChange", (data: { isOpen: boolean }) => {
          if (!data.isOpen) {
            // Se a fila foi fechada, atualizar estado
            setQueueInfo(null);
          }
        });
      } catch (socketErr) {
        console.error("Erro ao inicializar Socket.IO:", socketErr);
        setError("Erro ao conectar com o servidor de tempo real");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro geral na configuração do socket:", err);
      setError("Erro ao configurar a conexão em tempo real");
      setLoading(false);
    }

    // Limpar eventos e deixar a sala ao desmontar
    return () => {
      if (socketInitialized && socket) {
        try {
          socket.emit("leaveBarberRoom", barberId);
          socket.off("positionUpdate");
          socket.off("clientCalled");
          socket.off("queueStatusChange");
        } catch (e) {
          console.error("Erro ao desconectar socket:", e);
        }
      }
    };
  }, [barberId]);

  return {
    queueInfo,
    isCalled,
    loading,
    error,
    hasSocket
  };
}
