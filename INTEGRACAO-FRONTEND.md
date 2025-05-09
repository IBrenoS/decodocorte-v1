# Guia de Integração Frontend - DecoDoCorte API

Este documento fornece orientações para a integração do frontend com a API DecoDoCorte, facilitando o processo de desenvolvimento e garantindo uma implementação consistente.

## Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos](#requisitos)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Autenticação](#autenticação)
5. [Endpoints Principais](#endpoints-principais)
6. [Fluxos de Integração](#fluxos-de-integração)
7. [Gestão de Estado e Eventos em Tempo Real](#gestão-de-estado-e-eventos-em-tempo-real)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Testes de Integração](#testes-de-integração)

## Visão Geral

A DecoDoCorte API é uma solução backend para gerenciar filas de barbearia, permitindo a interação entre barbeiros e clientes em tempo real. A API oferece funcionalidades como cadastro e login de usuários, gestão de filas, histórico de atendimentos e estatísticas.

### Principais Funcionalidades

- **Autenticação**: Cadastro, login e gestão de perfil
- **Gerenciamento de Filas**: Abertura/fechamento de filas, entrada/saída de clientes
- **Serviços**: Cadastro e gerenciamento de serviços oferecidos pelos barbeiros
- **Histórico**: Registro de atendimentos para barbeiros e clientes
- **Estatísticas**: Dados de desempenho para barbeiros
- **Comunicação em Tempo Real**: Notificações e atualizações via Socket.IO

## Requisitos

- Node.js v14+
- Framework JavaScript moderno (React, Vue, Angular)
- Cliente HTTP (Axios recomendado)
- Cliente Socket.IO

## Configuração do Ambiente

### 1. Instalar Dependências

```bash
# Com npm
npm install axios socket.io-client

# Com yarn
yarn add axios socket.io-client
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` para armazenar configurações:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Configurar Cliente HTTP

```javascript
// api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros comuns
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login se o token expirou
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4. Configurar Socket.IO

```javascript
// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

let socket;

export const initSocket = (token) => {
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Conexão Socket.IO estabelecida");
  });

  socket.on("error", (error) => {
    console.error("Erro Socket.IO:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket não inicializado. Chame initSocket primeiro.");
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
```

## Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. O token deve ser incluído no cabeçalho `Authorization` de cada requisição.

### Registro de Usuários

```javascript
const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

### Login

```javascript
const login = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    const { token, user } = response.data;

    // Armazenar token
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Inicializar socket com token
    initSocket(token);

    return { token, user };
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

### Logout

```javascript
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  closeSocket();

  // Redirecionar para a página de login
  window.location.href = "/login";
};
```

## Endpoints Principais

A documentação completa está disponível em `/api-docs` da API. Abaixo estão os principais endpoints por funcionalidade:

### Perfil de Usuário

| Método | Endpoint                      | Descrição                    |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/api/users/me`               | Obtém dados do usuário atual |
| PUT    | `/api/users/me`               | Atualiza dados do perfil     |
| PUT    | `/api/users/me/profile-image` | Atualiza a imagem de perfil  |
| PUT    | `/api/users/me/password`      | Altera senha                 |

### Barbeiro - Fila

| Método | Endpoint                               | Descrição              |
| ------ | -------------------------------------- | ---------------------- |
| GET    | `/api/barber/queue`                    | Obtém fila atual       |
| POST   | `/api/barber/queue/open`               | Abre a fila            |
| POST   | `/api/barber/queue/close`              | Fecha a fila           |
| POST   | `/api/barber/queue/next`               | Chama próximo cliente  |
| POST   | `/api/barber/queue/:clientId/complete` | Finaliza atendimento   |
| DELETE | `/api/barber/queue/:clientId`          | Remove cliente da fila |

### Cliente - Fila

| Método | Endpoint                            | Descrição               |
| ------ | ----------------------------------- | ----------------------- |
| GET    | `/api/client/queue/:barberId`       | Verifica status da fila |
| POST   | `/api/client/queue/:barberId/join`  | Entra na fila           |
| DELETE | `/api/client/queue/:barberId/leave` | Sai da fila             |

### Barbeiro - Serviços

| Método | Endpoint                   | Descrição                 |
| ------ | -------------------------- | ------------------------- |
| GET    | `/api/barber/services`     | Lista serviços oferecidos |
| POST   | `/api/barber/services`     | Adiciona novo serviço     |
| PUT    | `/api/barber/services/:id` | Atualiza serviço          |
| DELETE | `/api/barber/services/:id` | Remove serviço            |

### Histórico e Estatísticas

| Método | Endpoint                       | Descrição                            |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/barber/history`          | Histórico de atendimentos (barbeiro) |
| GET    | `/api/client/history`          | Histórico de atendimentos (cliente)  |
| POST   | `/api/client/history/:id/rate` | Avalia atendimento                   |
| GET    | `/api/barber/stats`            | Estatísticas gerais do barbeiro      |

## Fluxos de Integração

### Fluxo do Barbeiro

1. **Login e Configuração**:

   - Autenticação como barbeiro
   - Configuração de serviços oferecidos

2. **Início do Dia**:

   - Abrir a fila para atendimentos
   - Verificar estatísticas do dia anterior

3. **Durante o Expediente**:

   - Monitorar fila em tempo real
   - Chamar próximo cliente
   - Finalizar atendimentos
   - Ver histórico recente

4. **Fim do Dia**:
   - Fechar fila
   - Verificar estatísticas do dia

### Fluxo do Cliente

1. **Login e Exploração**:

   - Autenticação como cliente
   - Explorar barbeiros disponíveis

2. **Entrada na Fila**:

   - Escolher barbeiro
   - Verificar status da fila
   - Entrar na fila

3. **Espera e Monitoramento**:

   - Monitorar posição na fila
   - Receber notificações
   - Opção de sair da fila

4. **Após Atendimento**:
   - Avaliar serviço recebido
   - Verificar histórico

## Gestão de Estado e Eventos em Tempo Real

Para uma experiência rica e responsiva, é importante implementar adequadamente o gerenciamento de estado e o tratamento de eventos em tempo real.

### Eventos Socket.IO

| Evento              | Finalidade                       | Destinatário                 |
| ------------------- | -------------------------------- | ---------------------------- |
| `queueUpdate`       | Atualizações no estado da fila   | Barbeiros e clientes na fila |
| `clientCalled`      | Cliente chamado para atendimento | Cliente específico           |
| `queueStatusChange` | Fila aberta ou fechada           | Todos os clientes            |
| `serviceCompleted`  | Serviço finalizado               | Cliente específico           |

### Exemplo de Subscrição a Eventos

```javascript
// Em um componente relacionado à fila
useEffect(() => {
  const socket = getSocket();

  // Para barbeiro
  if (userType === "barber") {
    socket.on("queueUpdate", (data) => {
      setQueueData(data);
    });
  }

  // Para cliente
  if (userType === "client") {
    socket.on("clientCalled", (data) => {
      setIsCalled(true);
      showNotification("É sua vez!");
    });
  }

  // Evento para ambos
  socket.on("queueStatusChange", (data) => {
    setQueueStatus(data);
  });

  // Entrar na sala específica do barbeiro
  if (barberId) {
    socket.emit("joinBarberRoom", barberId);
  }

  return () => {
    socket.off("queueUpdate");
    socket.off("clientCalled");
    socket.off("queueStatusChange");
  };
}, [barberId, userType]);
```

## Tratamento de Erros

A API retorna erros consistentes com códigos HTTP apropriados e mensagens descritivas. Implemente um sistema de tratamento de erros adequado:

```javascript
try {
  const response = await api.post("/api/client/queue/123/join");
  // Tratar sucesso
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        // Erro de validação ou lógica de negócio
        showError(error.response.data.message);
        break;
      case 401:
        // Não autenticado - redirecionar para login
        redirectToLogin();
        break;
      case 403:
        // Não autorizado - usuário não tem permissão
        showError("Você não tem permissão para realizar esta ação");
        break;
      case 404:
        // Recurso não encontrado
        showError("Recurso não encontrado");
        break;
      case 409:
        // Conflito (ex: já está na fila)
        showError(error.response.data.message);
        break;
      default:
        // Outros erros
        showError("Ocorreu um erro inesperado");
    }
  } else {
    // Erro de rede ou timeout
    showError("Erro de conexão com o servidor");
  }
}
```

## Testes de Integração

Para garantir a correta integração entre frontend e backend, implemente testes de integração:

1. **Configure um ambiente de teste**:

   - Utilize variáveis de ambiente separadas
   - Crie mocks para respostas da API

2. **Teste os fluxos principais**:

   - Autenticação
   - Fluxo de fila para barbeiros
   - Fluxo de fila para clientes

3. **Verifique o tratamento de erros**:

   - Respostas para tokens inválidos
   - Tentativas de ações não autorizadas

4. **Teste a comunicação em tempo real**:
   - Conexão Socket.IO
   - Recebimento e envio de eventos

### Exemplo de Teste com Jest e Testing Library

```javascript
test("Cliente consegue entrar na fila do barbeiro", async () => {
  // Configurar mock de API
  axiosMock.onPost("/api/client/queue/123/join").reply(200, {
    message: "Entrou na fila com sucesso",
    position: 3,
    joinedAt: new Date().toISOString(),
    queueId: "abc123",
  });

  // Renderizar componente
  const { getByText, findByText } = render(<JoinQueueButton barberId="123" />);

  // Acionar evento de click
  fireEvent.click(getByText("Entrar na Fila"));

  // Verificar resultado
  const successMessage = await findByText("Você está na posição 3 da fila");
  expect(successMessage).toBeInTheDocument();
});
```

---

## Recursos Adicionais

- [Documentação Completa da API (Swagger)](/api-docs)
- [Exemplos de Código](https://github.com/decodocorte/frontend-examples)
- [Guia de Estilo e Padrões de Design]()
- [FAQ de Integração]()

Para questões e suporte técnico, entre em contato com a equipe de desenvolvimento através do e-mail `tech@decodocorte.com`.

---

_Última atualização: 8 de maio de 2025_
