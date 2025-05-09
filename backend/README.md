# DecoDoCorte - Backend API

![DecoDoCorte API](https://via.placeholder.com/150x150.png?text=DecoDoCorte+API)

## 🖥️ Sobre a API

Esta é a API backend que alimenta o aplicativo DecoDoCorte, fornecendo todos os serviços necessários para gerenciamento de filas, usuários, histórico e estatísticas. Desenvolvida com Node.js e MongoDB, a API segue princípios RESTful e oferece integração em tempo real.

## 🛠️ Tecnologias Necessárias

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação baseada em tokens
- **Socket.io**: Comunicação em tempo real
- **sendgrid**: Serviço para envio de emails (verificação e recuperação de senha)

## 📊 Estrutura do Banco de Dados

### Coleções Principais:

#### Users
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // Hash da senha
  type: String, // "client" ou "barber"
  profileImage: String,
  notificationPreferences: {
    email: Boolean
  },
  emailVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### Queues
\`\`\`javascript
{
  _id: ObjectId,
  barberId: ObjectId,
  isOpen: Boolean,
  maxClients: Number,
  autoClose: Boolean,
  clients: [
    {
      userId: ObjectId,
      position: Number,
      joinedAt: Date,
      status: String // "waiting", "in-progress", "completed", "cancelled"
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### Services
\`\`\`javascript
{
  _id: ObjectId,
  barberId: ObjectId,
  clientId: ObjectId,
  serviceType: String,
  price: Number,
  duration: Number,
  startTime: Date,
  endTime: Date,
  rating: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### BarberSettings
\`\`\`javascript
{
  _id: ObjectId,
  barberId: ObjectId,
  workDays: [Number],
  maxClientsPerDay: Number,
  autoCloseQueue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/register`: Registra um novo usuário
- `POST /api/auth/login`: Autentica um usuário existente
- `POST /api/auth/verify-email`: Verifica o email do usuário
- `POST /api/auth/forgot-password`: Inicia o processo de recuperação de senha
- `POST /api/auth/reset-password`: Redefine a senha com token
- `POST /api/auth/logout`: Encerra sessão do usuário

### Usuários
- `GET /api/users/me`: Obtém dados do usuário atual
- `PUT /api/users/me`: Atualiza dados do usuário
- `PUT /api/users/me/profile-image`: Atualiza imagem de perfil
- `PUT /api/users/me/password`: Altera a senha do usuário

### Filas (Barbeiros)
- `GET /api/barber/queue`: Obtém fila atual
- `POST /api/barber/queue/open`: Abre a fila
- `POST /api/barber/queue/close`: Fecha a fila
- `PUT /api/barber/queue/client/:id/complete`: Marca cliente como atendido
- `PUT /api/barber/queue/client/:id/remove`: Remove cliente da fila

### Filas (Clientes)
- `GET /api/client/queue/:barberId`: Obtém status da fila
- `POST /api/client/queue/:barberId/join`: Entra na fila
- `DELETE /api/client/queue/:barberId/leave`: Sai da fila

### Histórico
- `GET /api/client/history`: Obtém histórico de atendimentos (cliente)
- `GET /api/barber/history`: Obtém histórico de atendimentos (barbeiro)
- `POST /api/client/history/:serviceId/rate`: Avalia um atendimento

### Estatísticas
- `GET /api/barber/stats`: Obtém estatísticas gerais
- `GET /api/barber/stats/daily`: Obtém estatísticas diárias
- `GET /api/barber/stats/weekly`: Obtém estatísticas semanais
- `GET /api/barber/stats/monthly`: Obtém estatísticas mensais

## 🔄 Integração com Frontend

A API se integra com o frontend através de:

1. **Requisições HTTP**: Para operações CRUD padrão
2. **WebSockets**: Para atualizações em tempo real da fila
3. **Autenticação JWT**: Tokens enviados nos headers das requisições

### Exemplo de Integração com WebSockets:

\`\`\`javascript
// No backend
io.on('connection', (socket) => {
  socket.on('joinBarberRoom', (barberId) => {
    socket.join(`barber-${barberId}`);
  });

  // Quando a fila é atualizada
  socket.to(`barber-${barberId}`).emit('queueUpdated', updatedQueue);
});

// No frontend
const socket = io(API_URL);
socket.emit('joinBarberRoom', barberId);
socket.on('queueUpdated', (queue) => {
  // Atualiza a interface
});
\`\`\`

## 🔧 Configuração e Execução

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/decodocorte-backend.git

# Acesse a pasta do projeto
cd decodocorte-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute o servidor em modo desenvolvimento
npm run dev

# Para produção
npm start
\`\`\`

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

\`\`\`
# Servidor
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/decodocorte

# JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=7d

# Email (para verificação e recuperação de senha)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=seu_email@example.com
EMAIL_PASS=sua_senha_email
EMAIL_FROM=noreply@decodocorte.com

# Cors
CORS_ORIGIN=http://localhost:3000
\`\`\`

## 📊 Monitoramento e Logs

A API utiliza:
- **Winston**: Para logging estruturado
- **Morgan**: Para logging de requisições HTTP
- **PM2**: Para gerenciamento de processos em produção

## 🧪 Testes

\`\`\`bash
# Executar testes unitários
npm run test

# Executar testes com cobertura
npm run test:coverage
\`\`\`

## 🚀 Implantação

Recomendações para implantação:
- **Servidor**: AWS EC2, Digital Ocean, Heroku
- **Banco de Dados**: MongoDB Atlas
- **CI/CD**: GitHub Actions, CircleCI
- **Monitoramento**: PM2, New Relic

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
