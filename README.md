# SaaS Dental Chatbot – Template Base

Template reutilizável de site com chatbot IA integrado para clínicas odontológicas.
Cada cliente recebe um deploy próprio com suas informações personalizadas via `clinic.json`.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Vite 5 + React 18 + TailwindCSS 3 |
| Backend | Vercel Serverless Functions (Node.js 20) |
| IA | OpenAI `gpt-4o-mini` |
| Banco | Nenhum na V1 (pronto para Supabase) |
| Deploy | Vercel |

---

## Estrutura do Projeto

```
projeto-microempresa/
├── api/
│   └── chat.js              # Serverless function – POST /api/chat
├── public/
│   └── tooth.svg            # Favicon SVG
├── src/
│   ├── components/
│   │   ├── ChatWidget.jsx   # Bolha flutuante (abre/fecha chat)
│   │   ├── ChatWindow.jsx   # Modal de chat (mensagens + input)
│   │   └── MessageBubble.jsx # Balão individual + botão WhatsApp CTA
│   ├── data/
│   │   ├── clinic.json      # Dados da clínica (personalizar por cliente)
│   │   └── faq.json         # Base de 15 perguntas frequentes
│   ├── pages/
│   │   └── Home.jsx         # Landing page completa (7 seções)
│   ├── utils/
│   │   ├── buildPrompt.js   # System prompt + FAQ matching + sanitização
│   │   └── rateLimiter.js   # Rate limit por IP (30/min) e sessão (20 msgs)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Tailwind + CSS variables dinâmicas
├── .env.example             # Template de variáveis de ambiente
├── .gitignore
├── dev-server.js            # Servidor local para testar a API (porta 3001)
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json              # Config de deploy Vercel
└── vite.config.js           # Proxy /api → localhost:3001 em dev
```

---

## Rodar Localmente (Passo a Passo)

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/SEU_USUARIO/projeto-microempresa.git
cd projeto-microempresa
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e insira sua chave da OpenAI:

```
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Rodar o projeto (2 terminais)

**Terminal 1 – Frontend (Vite, porta 5173):**
```bash
npm run dev
```

**Terminal 2 – API local (Node, porta 3001):**
```bash
node dev-server.js
```

### 4. Acessar

Abra o navegador em: **http://localhost:5173**

O Vite faz proxy automático de `/api/*` → `localhost:3001` (configurado em `vite.config.js`), então o chatbot funciona sem nenhuma configuração extra.

---

## Deploy na Vercel (Passo a Passo)

### Opção A: Via GitHub (recomendado)

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Importe o repositório do GitHub
4. O framework será detectado automaticamente como **Vite**
5. Em **Environment Variables**, adicione:
   - `OPENAI_API_KEY` = sua chave da OpenAI
6. Clique em **Deploy**
7. Pronto! O site estará em `https://seu-projeto.vercel.app`

### Opção B: Via CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy de preview (para testar)
vercel

# Deploy para produção
vercel --prod
```

Na primeira vez, a CLI pergunta as configurações. Aceite os padrões.
Depois, configure `OPENAI_API_KEY` em: **Vercel Dashboard → Settings → Environment Variables**.

### Variáveis de ambiente obrigatórias na Vercel

| Variável | Descrição |
|----------|-----------|
| `OPENAI_API_KEY` | Chave da API OpenAI (obrigatória) |

---

## Personalizar para um Novo Cliente

Edite **apenas** o arquivo `src/data/clinic.json`. Todos os campos são usados automaticamente:

- **name** → Nome exibido no header, footer, chat e title da página
- **whatsapp** → Número usado em TODOS os botões "Agendar pelo WhatsApp" (formato: apenas dígitos, sem +)
- **primaryColor/Dark/Light** → Cores de toda a interface (injetadas via CSS variables)
- **services** → Lista de serviços exibida na seção "Especialidades"
- **insurances** → Convênios exibidos na seção "Convênios aceitos"
- **chatbot.greeting** → Primeira mensagem do chatbot ao abrir
- **hours** → Horários exibidos no footer e usados pelo chatbot

O FAQ (`faq.json`) pode ser personalizado por cliente para refletir as dúvidas reais de cada clínica.

---

## Arquitetura

```
Usuário
  │
  ▼
ChatWidget (React)
  │  abre/fecha
  ▼
ChatWindow (React)
  │  fetch('/api/chat')  ← Frontend chama exatamente este caminho
  ▼
api/chat.js (Vercel Serverless Function)
  │
  ├─► Sanitizar input (anti prompt injection + XSS)
  ├─► Rate limit por IP (30 req/min, bloqueio 5 min)
  ├─► Limit por sessão (20 mensagens)
  ├─► Buscar FAQ (zero custo de IA)
  │     └─ match score >= 2 → retorna direto
  └─► OpenAI gpt-4o-mini (fallback)
        max_tokens: 300
        histórico: últimas 5 trocas
```

### Controle de custo

- Máximo **300 tokens** por resposta da IA
- Histórico limitado a **5 pares** (10 mensagens)
- **FAQ matching** evita chamar a IA para perguntas comuns (15 FAQs pré-configuradas)
- Rate limit: **30 req/min por IP**, bloqueio temporário de 5 min se exceder
- Sessão: máximo de **20 mensagens** por sessão do navegador

---

## Segurança

- API key nunca exposta no frontend (apenas no serverless function)
- Input sanitizado contra prompt injection e XSS
- Headers de segurança via `vercel.json` (X-Frame-Options DENY, nosniff, Referrer-Policy)
- Sem armazenamento de dados pessoais na V1
- Rate limiting por IP e por sessão

---

## Roadmap V2 (Multi-tenant)

- [ ] Supabase para persistência de conversas
- [ ] Dashboard admin por clínica
- [ ] Logs de uso por tenant_id
- [ ] Controle de quota por cliente
- [ ] Webhook para notificar recepção de novos leads
