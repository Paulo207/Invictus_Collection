# Invictus Collection - Chat Automation Platform

Uma plataforma de automação de chat inspirada no ManyChat, desenvolvida para a Virtus Collection Store. Este sistema permite criar fluxos de conversação automatizados, gerenciar contatos e integrar com múltiplos canais de comunicação.

## 🚀 Características Principais

### Inspirado no ManyChat
- ✅ **Visual Flow Builder** - Crie fluxos de automação visualmente
- ✅ **Multi-Channel Support** - Suporte para WhatsApp, chat web e mais
- ✅ **Automated Responses** - Respostas automáticas baseadas em palavras-chave
- ✅ **Contact Management** - Sistema completo de gestão de contatos
- ✅ **Analytics Dashboard** - Dashboard com estatísticas em tempo real
- ✅ **Message Templates** - Templates de mensagens reutilizáveis
- ✅ **Keyword Triggers** - Gatilhos baseados em palavras-chave
- ✅ **Chat Widget** - Widget de chat embarcável para sites

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Paulo207/Invictus_Collection.git
cd Invictus_Collection
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse a aplicação:
- Dashboard Admin: http://localhost:3000/admin.html
- Loja Virtual: http://localhost:3000/index.html
- Chat Widget Demo: http://localhost:3000/chat-widget.html

## 📖 Como Usar

### 1. Acessar o Dashboard Admin

Navegue para `http://localhost:3000/admin.html` para acessar o painel de administração.

### 2. Criar um Fluxo de Automação

1. Clique em **"Fluxos"** no menu lateral
2. Clique em **"Criar Novo Fluxo"**
3. Preencha os dados:
   - **Nome**: Nome descritivo do fluxo (ex: "Boas-vindas")
   - **Descrição**: Objetivo do fluxo
   - **Tipo de Gatilho**: Escolha como o fluxo será ativado
   - **Palavra-chave**: Palavra que ativa o fluxo (ex: "oi", "olá", "produtos")
   - **Mensagem de Resposta**: Mensagem automática a ser enviada

4. Clique em **"Criar Fluxo"**

### 3. Gerenciar Contatos

1. Vá para a seção **"Contatos"**
2. Adicione novos contatos manualmente ou eles serão criados automaticamente quando enviarem mensagens
3. Visualize o histórico de mensagens de cada contato

### 4. Testar Automações

1. Acesse a seção **"Simulador"**
2. Digite um número de telefone
3. Envie uma mensagem contendo a palavra-chave configurada
4. Veja a resposta automática gerada pelo fluxo

### 5. Integrar o Chat Widget

Para adicionar o chat widget ao seu site, inclua o seguinte código antes do `</body>`:

```html
<div class="chat-widget">
    <button class="chat-button" onclick="toggleChat()">💬</button>
    <div class="chat-window" id="chatWindow">
        <!-- Widget content -->
    </div>
</div>
<script src="chat-widget.js"></script>
```

## 🎯 Exemplos de Uso

### Fluxo de Boas-vindas
- **Gatilho**: "oi", "olá", "ola"
- **Resposta**: "Olá! Bem-vindo à Virtus Collection Store! 👋 Como posso ajudar você hoje?"

### Fluxo de Produtos
- **Gatilho**: "produtos", "catálogo", "ver produtos"
- **Resposta**: "Temos uma coleção exclusiva! Confira nossos produtos em destaque: [link]"

### Fluxo de Atendimento
- **Gatilho**: "atendimento", "ajuda", "suporte"
- **Resposta**: "Estou aqui para ajudar! Nossa equipe está disponível de segunda a sexta, das 9h às 18h. Como posso auxiliar?"

## 🏗️ Arquitetura

### Backend (Node.js + Express)
- API RESTful para gerenciamento de fluxos, contatos e mensagens
- Banco de dados SQLite para persistência
- Sistema de webhooks para integração com plataformas externas

### Frontend
- **Admin Dashboard**: Interface de administração completa
- **Chat Widget**: Widget embarcável para sites
- **Store Front**: Página da loja integrada

### Banco de Dados
- **flows**: Fluxos de automação
- **contacts**: Base de contatos
- **messages**: Histórico de mensagens
- **analytics**: Dados de análise e métricas

## 📊 API Endpoints

### Fluxos
- `GET /api/flows` - Lista todos os fluxos
- `GET /api/flows/:id` - Obtém um fluxo específico
- `POST /api/flows` - Cria um novo fluxo
- `PUT /api/flows/:id` - Atualiza um fluxo
- `DELETE /api/flows/:id` - Remove um fluxo

### Contatos
- `GET /api/contacts` - Lista todos os contatos
- `POST /api/contacts` - Cria um novo contato

### Mensagens
- `GET /api/messages/:contactId` - Lista mensagens de um contato
- `POST /api/messages` - Envia uma mensagem
- `POST /api/webhook/message` - Webhook para receber mensagens

### Analytics
- `GET /api/analytics` - Obtém estatísticas gerais

## 🔐 Segurança

- Validação de entrada em todos os endpoints
- Sanitização de dados
- Proteção contra SQL injection através de prepared statements
- CORS configurado apropriadamente

## 🚀 Próximos Passos

- [ ] Integração real com WhatsApp Business API
- [ ] Suporte para múltiplos tipos de nós no flow builder
- [ ] Condições e ramificações nos fluxos
- [ ] Agendamento de mensagens
- [ ] Segmentação avançada de contatos
- [ ] Relatórios e analytics detalhados
- [ ] Integração com Facebook Messenger
- [ ] Sistema de tags para contatos
- [ ] Templates de mensagens ricas (imagens, botões, etc.)
- [ ] Testes A/B de fluxos

## 🛠️ Desenvolvimento

Para executar em modo de desenvolvimento com auto-reload:

```bash
npm run dev
```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença ISC.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📧 Suporte

Para suporte, entre em contato através das redes sociais da Virtus Collection Store ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ para a Virtus Collection Store
