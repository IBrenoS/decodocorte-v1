# DecoDoCorte - Frontend

![DecoDoCorte Logo](https://via.placeholder.com/150x150.png?text=DecoDoCorte)

## 📱 Sobre o Projeto

DecoDoCorte é uma aplicação web e mobile que simplifica o gerenciamento de filas e agendamentos para barbearias. O projeto foi desenvolvido para resolver o problema comum de longas esperas e desorganização em barbearias, oferecendo uma solução digital tanto para barbeiros quanto para clientes.

## 🚀 Funcionalidades Principais

### Para Clientes:
- **Fila Virtual**: Entre na fila sem precisar estar fisicamente na barbearia
- **Tempo Estimado**: Visualize sua posição na fila e o tempo estimado de espera
- **Histórico de Atendimentos**: Acompanhe todos os seus cortes anteriores
- **Avaliações**: Avalie o serviço após cada atendimento
- **Perfil Personalizado**: Gerencie suas informações e preferências

### Para Barbeiros:
- **Gerenciamento de Fila**: Controle a fila de espera em tempo real
- **Dashboard**: Visualize estatísticas e métricas de atendimento
- **Histórico de Clientes**: Acesse o histórico completo de atendimentos
- **Configurações Personalizadas**: Defina limites de clientes, horários e mais
- **Análise de Desempenho**: Acompanhe avaliações e métricas de satisfação

## 💻 Tecnologias Utilizadas

- **Next.js**: Framework React para renderização híbrida
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Componentes reutilizáveis
- **Lucide React**: Biblioteca de ícones

## 🔧 Instalação e Execução

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/decodocorte.git

# Acesse a pasta do projeto
cd decodocorte

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
\`\`\`

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

\`\`\`
decodocorte/
├── app/                    # Rotas e páginas da aplicação
│   ├── barber/             # Área do barbeiro
│   ├── client/             # Área do cliente
│   ├── login/              # Autenticação
│   └── profile/            # Perfil de usuário
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes de UI
│   ├── barber-layout.tsx   # Layout para área do barbeiro
│   └── client-layout.tsx   # Layout para área do cliente
├── hooks/                  # Hooks personalizados
├── lib/                    # Utilitários e funções auxiliares
├── public/                 # Arquivos estáticos
└── styles/                 # Estilos globais
\`\`\`

## 🔄 Sistema de Autenticação

O sistema utiliza autenticação baseada em email e senha:

1. **Registro**: Os usuários se cadastram fornecendo email e senha
2. **Verificação**: Um email de verificação é enviado para confirmar a identidade
3. **Login**: Acesso com email e senha
4. **Recuperação de Senha**: Processo seguro para redefinição de senha via email

## 🔄 Integração com Backend

O frontend se comunica com o backend através de uma API RESTful. As principais integrações incluem:

- Autenticação via email e senha
- Gerenciamento de filas em tempo real
- Armazenamento e recuperação de histórico de atendimentos
- Sistema de avaliações
- Estatísticas e métricas

Para mais detalhes sobre o backend, consulte o [README do Backend](./backend/README.md).

## 📱 Responsividade

O aplicativo é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:
- **Mobile**: Interface otimizada para smartphones
- **Tablet**: Layout adaptado para telas médias
- **Desktop**: Experiência completa para telas maiores

## 🔜 Próximos Passos

- Sistema de agendamento prévio
- Integração com pagamentos
- Notificações push
- Sistema de fidelidade
- Personalização de temas

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
