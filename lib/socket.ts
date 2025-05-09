import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket) {
    // Se o socket já existe mas está desconectado, tenta reconectar
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
    return socket;
  }

  // Verificar se o token foi fornecido
  if (!token) {
    throw new Error("Token de autenticação é necessário para inicializar o socket");
  }

  try {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Conexão Socket.IO estabelecida");
    });

    socket.on("disconnect", (reason) => {
      console.log("Conexão Socket.IO encerrada:", reason);
    });

    socket.on("error", (error) => {
      console.error("Erro Socket.IO:", error);
    });

    socket.on("connect_error", (error) => {
      console.error("Erro de conexão Socket.IO:", error);
    });

    return socket;
  } catch (error) {
    console.error("Erro ao inicializar Socket.IO:", error);
    throw error;
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    // Verificar se estamos no cliente e se há um token disponível
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Tentar inicializar o socket automaticamente
          return initSocket(token);
        } catch (error) {
          console.error("Falha ao inicializar socket automaticamente:", error);
          throw new Error("Falha ao inicializar socket. Verifique sua conexão.");
        }
      } else {
        throw new Error("Autenticação necessária para usar o socket.");
      }
    }
    throw new Error("Socket não inicializado. Chame initSocket primeiro.");
  }
  return socket;
};

export const closeSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
  socket = null;
};

export const joinBarberRoom = (barberId: string): void => {
  if (socket) {
    socket.emit("joinBarberRoom", barberId);
  }
};

export const leaveBarberRoom = (barberId: string): void => {
  if (socket) {
    socket.emit("leaveBarberRoom", barberId);
  }
};
