import axios, { AxiosError, AxiosResponse } from "axios";
import { getHttpErrorMessage, isTokenExpired } from "./errors";

// Obter URL da API do ambiente ou usar fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Interface para estender o tipo de erro do Axios
interface ApiError extends AxiosError {
  friendlyMessage?: string;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    // No ambiente cliente (browser), obter token do localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros comuns
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: ApiError) => {
    // Verificar se estamos no ambiente do cliente (browser)
    if (typeof window !== 'undefined') {
      // Caso de token expirado
      if (error.response?.status === 401) {
        // Verificar se é um problema de autenticação
        const token = localStorage.getItem("token");

        if (token && isTokenExpired(token)) {
          console.log("Token expirado. Redirecionando para login...");
        } else {
          console.log("Erro de autenticação. Redirecionando para login...");
        }

        // Em ambos os casos, limpar dados e redirecionar
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
      }

      // Adicionar mensagem amigável para outros erros HTTP
      if (error.response) {
        const statusMessage = getHttpErrorMessage(error.response.status);
        const responseData = error.response.data as { message?: string };
        error.friendlyMessage = responseData?.message || statusMessage;
      } else if (error.request) {
        // Requisição foi feita mas não houve resposta
        error.friendlyMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      } else {
        // Algo aconteceu na configuração da requisição
        error.friendlyMessage = "Erro ao processar sua solicitação.";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
