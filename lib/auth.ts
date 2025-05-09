import api from "./api";
import { closeSocket, initSocket } from "./socket";

export type UserType = "barber" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  type: UserType;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

export interface LoginCredentials {
  email: string;
  password: string;
  type: UserType;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Registra um novo usuário
 */
export const registerUser = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await api.post<{ user: User }>("/api/auth/register", userData);
    return response.data.user;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Verifica o código de confirmação enviado para o email
 */
export const verifyCode = async (email: string, code: string): Promise<{ verified: boolean }> => {
  try {
    const response = await api.post<{ verified: boolean }>("/api/auth/verify", { email, code });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Realiza o login do usuário
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/api/auth/login", credentials);
    const { token, user } = response.data;

    // Armazenar token e dados do usuário
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Inicializar socket com token
      initSocket(token);
    }

    return { token, user };
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Realiza o logout do usuário
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeSocket();

    // Redirecionar para a página inicial
    window.location.href = "/";
  }
};

/**
 * Obtém os dados do usuário logado
 */
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
  }
  return null;
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem("token");
  }
  return false;
};

/**
 * Atualiza o perfil do usuário
 */
export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<{ user: User }>("/api/users/me", profileData);

    // Atualiza dados do usuário no localStorage
    if (typeof window !== 'undefined') {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }

    return response.data.user;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Solicita redefinição de senha
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>("/api/auth/reset-password", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Atualiza senha do usuário
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.put<{ success: boolean }>("/api/users/me/password", {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
