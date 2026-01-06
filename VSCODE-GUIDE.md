# Como Rodar o App no VS Code

## 🚀 Opções para Executar o Aplicativo

### Opção 1: Usando o Terminal Integrado (Mais Simples)

1. **Abra o VS Code** na pasta do projeto
2. **Abra o Terminal Integrado**: `Ctrl + '` (ou `View > Terminal`)
3. **Instale as dependências** (primeira vez apenas):
   ```bash
   npm install
   ```
4. **Inicie o servidor**:
   ```bash
   npm start
   ```
5. **Acesse no navegador**:
   - Admin Dashboard: http://localhost:3000/admin.html
   - Loja: http://localhost:3000/index.html

### Opção 2: Usando Tarefas do VS Code

1. **Pressione** `Ctrl + Shift + P` (ou `Cmd + Shift + P` no Mac)
2. **Digite**: "Tasks: Run Task"
3. **Escolha uma das opções**:
   - `Instalar Dependências` - Instala os pacotes npm
   - `Iniciar Servidor` - Inicia o servidor de produção
   - `Iniciar em Modo Desenvolvimento` - Inicia com auto-reload (nodemon)

### Opção 3: Usando o Debugger do VS Code (Para Desenvolvimento)

1. **Vá para a aba Debug** (Ctrl + Shift + D)
2. **Escolha uma configuração**:
   - `Iniciar Servidor Chat Automation` - Servidor normal
   - `Iniciar com Nodemon (Dev)` - Com auto-reload
3. **Pressione F5** ou clique no botão verde ▶️

## 📁 Estrutura de Arquivos

```
Invictus_Collection/
├── server.js           # Servidor backend (Node.js + Express)
├── admin.html          # Dashboard administrativo
├── admin.js            # JavaScript do dashboard
├── index.html          # Página da loja (com chat widget)
├── chat-widget.html    # Demo standalone do widget
├── package.json        # Dependências do projeto
└── README.md          # Documentação completa
```

## 🔧 Comandos Úteis

### No Terminal do VS Code

```bash
# Instalar dependências
npm install

# Iniciar servidor (modo produção)
npm start

# Iniciar servidor (modo desenvolvimento com auto-reload)
npm run dev
```

## 🌐 URLs de Acesso

Após iniciar o servidor, acesse:

- **Dashboard Admin**: http://localhost:3000/admin.html
  - Criar e gerenciar fluxos de automação
  - Visualizar contatos e mensagens
  - Analytics em tempo real
  
- **Loja**: http://localhost:3000/index.html
  - Página da loja com chat widget integrado
  
- **Widget Demo**: http://localhost:3000/chat-widget.html
  - Demo standalone do chat widget

## 🐛 Debugando no VS Code

### Colocar Breakpoints

1. Clique na margem esquerda do editor (ao lado do número da linha)
2. Um ponto vermelho aparecerá
3. Inicie o debugger (F5)
4. O código pausará nos breakpoints

### Console de Debug

- Use `console.log()` no código
- Os logs aparecem no **Debug Console** do VS Code
- Também aparecem no **Terminal Integrado**

## 💡 Dicas

### Atalhos Úteis do VS Code

- `Ctrl + '` - Abrir/Fechar Terminal
- `Ctrl + Shift + D` - Abrir Debug
- `F5` - Iniciar Debug
- `Shift + F5` - Parar Debug
- `Ctrl + C` (no terminal) - Parar o servidor

### Live Reload

Para ter auto-reload ao salvar arquivos:
1. Use `npm run dev` (usa nodemon)
2. Ou escolha "Iniciar com Nodemon (Dev)" no debugger

### Abrir Múltiplos Terminais

- Clique no ícone `+` no painel de terminal
- Ou pressione `Ctrl + Shift + '`
- Útil para rodar servidor em um e comandos em outro

## ❗ Solucionando Problemas

### Porta 3000 já está em uso

```bash
# No Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# No Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Dependências não instaladas

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro ao iniciar o servidor

1. Verifique se o Node.js está instalado: `node --version`
2. Verifique se está na pasta correta do projeto
3. Certifique-se de ter executado `npm install`

## 📚 Recursos Adicionais

- **README.md** - Documentação completa da API
- **package.json** - Lista de dependências
- **server.js** - Código do servidor (bem comentado)

## 🎯 Fluxo de Trabalho Recomendado

1. **Abra o VS Code** na pasta do projeto
2. **Primeira vez**: Execute `npm install` no terminal
3. **Desenvolvimento**: 
   - Use F5 com "Iniciar com Nodemon (Dev)"
   - Edite os arquivos - servidor reinicia automaticamente
4. **Teste**: Acesse http://localhost:3000/admin.html
5. **Debug**: Coloque breakpoints e use F5

---

**Pronto! Agora você pode rodar e desenvolver o app direto no VS Code! 🚀**
