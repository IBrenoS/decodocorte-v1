import api from "./api";

export interface Barber {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  description?: string;
  rating?: number;
  queueStatus: {
    isOpen: boolean;
    clientsCount: number;
    estimatedWaitTime: number; // em minutos
  };
}

export interface ClientQueueInfo {
  barberId: string;
  barberName: string;
  joinedAt: string;
  position: number;
  estimatedWait: number; // em minutos
  queueId: string;
}

export interface ClientHistoryItem {
  id: string;
  barberId: string;
  barberName: string;
  barberProfileImage?: string;
  serviceName?: string;
  servicePrice?: number;
  completedAt: string;
  duration: number;
  rating?: number; // 1 a 5 estrelas
  feedback?: string;
}

/**
 * Lista barbeiros disponíveis
 */
export const getAvailableBarbers = async (): Promise<Barber[]> => {
  try {
    const response = await api.get<{ barbers: Barber[] }>("/api/client/barbers");
    return response.data.barbers;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém informações de um barbeiro específico
 */
export const getBarberDetails = async (barberId: string): Promise<Barber> => {
  try {
    const response = await api.get<{ barber: Barber }>(`/api/client/barbers/${barberId}`);
    return response.data.barber;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Verifica status da fila de um barbeiro
 */
export const getBarberQueueStatusForClient = async (barberId: string): Promise<Barber["queueStatus"]> => {
  try {
    const response = await api.get<{ status: Barber["queueStatus"] }>(`/api/client/queue/${barberId}`);
    return response.data.status;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Cliente entra na fila de um barbeiro
 */
export const joinBarberQueue = async (
  barberId: string,
  serviceId?: string
): Promise<ClientQueueInfo> => {
  try {
    const response = await api.post<{ queueInfo: ClientQueueInfo }>(
      `/api/client/queue/${barberId}/join`,
      { serviceId }
    );
    return response.data.queueInfo;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Cliente sai da fila de um barbeiro
 */
export const leaveBarberQueue = async (barberId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/api/client/queue/${barberId}/leave`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Verifica posição atual na fila
 */
export const checkQueuePosition = async (barberId: string): Promise<ClientQueueInfo | null> => {
  try {
    const response = await api.get<{ queueInfo: ClientQueueInfo | null }>(
      `/api/client/queue/${barberId}/position`
    );
    return response.data.queueInfo;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém histórico de atendimentos do cliente
 */
export const getClientHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<{ history: ClientHistoryItem[]; total: number; pages: number }> => {
  try {
    const response = await api.get(`/api/client/history?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Avalia um atendimento
 */
export const rateService = async (
  historyId: string,
  rating: number,
  feedback?: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>(
      `/api/client/history/${historyId}/rate`,
      { rating, feedback }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
