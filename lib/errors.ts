/**
 * Formata mensagens de erro da API para exibição ao usuário
 */
export const formatApiError = (error: any): string => {
  // Se o erro é uma resposta da API
  if (error.response?.data) {
    // Verificar se a resposta tem uma mensagem específica
    if (error.response.data.message) {
      return error.response.data.message;
    }

    // Tentar interpretar erros de validação
    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.map((e: any) => e.message || e).join(', ');
    }
  }

  // Para erros de rede
  if (error.message === 'Network Error') {
    return 'Erro de conexão com o servidor. Verifique sua internet.';
  }

  // Para timeout
  if (error.code === 'ECONNABORTED') {
    return 'O servidor demorou a responder. Tente novamente.';
  }

  // Para outros erros
  return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
};

/**
 * Mapeia códigos HTTP para mensagens amigáveis
 */
export const getHttpErrorMessage = (statusCode: number): string => {
  const errorMessages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autorizado. Faça login novamente.',
    403: 'Você não tem permissão para acessar este recurso',
    404: 'Recurso não encontrado',
    409: 'Conflito na operação. Talvez este recurso já exista.',
    422: 'Dados inválidos fornecidos',
    429: 'Muitas requisições. Tente novamente em alguns minutos.',
    500: 'Erro interno do servidor',
    502: 'Erro de gateway',
    503: 'Serviço indisponível no momento',
    504: 'Tempo limite do gateway excedido',
  };

  return errorMessages[statusCode] || 'Ocorreu um erro inesperado';
};

/**
 * Verifica se o token está expirado com base no payload
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    if (!payload.exp) return false;

    const expirationTime = payload.exp * 1000; // Converter para milissegundos
    return Date.now() >= expirationTime;
  } catch (e) {
    return true; // Se houver algum erro ao analisar o token, considere-o expirado
  }
};
