import api from "./api";

export interface QueueClient {
  id: string;
  name: string;
  profileImage?: string;
  joinedAt: string;
  position: number;
  estimatedWait: number; // em minutos
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // em minutos
  active: boolean;
}

export interface QueueStatus {
  isOpen: boolean;
  clientsCount: number;
  estimatedWaitTime: number; // em minutos
  openedAt?: string;
  closedAt?: string;
}

export interface HistoryItem {
  id: string;
  clientId: string;
  clientName: string;
  clientProfileImage?: string;
  serviceId?: string;
  serviceName?: string;
  startedAt: string;
  completedAt: string;
  duration: number; // em minutos
  rating?: number; // 1 a 5 estrelas
  feedback?: string;
}

export interface Stats {
  today: {
    clientsServed: number;
    averageRating: number;
    averageServiceTime: number; // em minutos
  };
  week: {
    clientsServed: number;
    averageRating: number;
    averageServiceTime: number; // em minutos
    ratingsPerDay: number[];
    clientsPerDay: number[];
  };
  month: {
    clientsServed: number;
    averageRating: number;
    averageServiceTime: number; // em minutos
    topServices: {
      serviceName: string;
      count: number;
    }[];
  };
}

/**
 * Obtém a fila atual do barbeiro
 */
export const getBarberQueue = async (): Promise<QueueClient[]> => {
  try {
    const response = await api.get<{ queue: QueueClient[] }>("/api/barber/queue");
    return response.data.queue;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Abre a fila do barbeiro
 */
export const openBarberQueue = async (): Promise<QueueStatus> => {
  try {
    const response = await api.post<{ status: QueueStatus }>("/api/barber/queue/open");
    return response.data.status;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Fecha a fila do barbeiro
 */
export const closeBarberQueue = async (): Promise<QueueStatus> => {
  try {
    const response = await api.post<{ status: QueueStatus }>("/api/barber/queue/close");
    return response.data.status;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Chama o próximo cliente da fila
 */
export const callNextClient = async (): Promise<QueueClient | null> => {
  try {
    const response = await api.post<{ client: QueueClient | null }>("/api/barber/queue/next");
    return response.data.client;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Finaliza o atendimento de um cliente
 */
export const completeClientService = async (
  clientId: string,
  serviceId?: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>(
      `/api/barber/queue/${clientId}/complete`,
      { serviceId }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Remove um cliente da fila
 */
export const removeClientFromQueue = async (clientId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/api/barber/queue/${clientId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém o status atual da fila do barbeiro
 */
export const getBarberQueueStatus = async (): Promise<QueueStatus> => {
  try {
    const response = await api.get<{ status: QueueStatus }>("/api/barber/queue/status");
    return response.data.status;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Lista todos os serviços oferecidos pelo barbeiro
 */
export const getBarberServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get<{ services: Service[] }>("/api/barber/services");
    return response.data.services;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Adiciona um novo serviço
 */
export const addBarberService = async (service: Omit<Service, "id">): Promise<Service> => {
  try {
    const response = await api.post<{ service: Service }>("/api/barber/services", service);
    return response.data.service;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza um serviço existente
 */
export const updateBarberService = async (
  serviceId: string,
  serviceData: Partial<Service>
): Promise<Service> => {
  try {
    const response = await api.put<{ service: Service }>(
      `/api/barber/services/${serviceId}`,
      serviceData
    );
    return response.data.service;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Remove um serviço
 */
export const deleteBarberService = async (serviceId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/api/barber/services/${serviceId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém o histórico de atendimentos do barbeiro
 */
export const getBarberHistory = async (
  page: number = 1,
  limit: number = 10,
  startDate?: Date,
  endDate?: Date
): Promise<{ history: HistoryItem[]; total: number; pages: number }> => {
  try {
    let url = `/api/barber/history?page=${page}&limit=${limit}`;

    if (startDate) {
      url += `&startDate=${startDate.toISOString()}`;
    }

    if (endDate) {
      url += `&endDate=${endDate.toISOString()}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Obtém estatísticas do barbeiro
 */
export const getBarberStats = async (): Promise<Stats> => {
  try {
    const response = await api.get<{ stats: Stats }>("/api/barber/stats");
    return response.data.stats;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
