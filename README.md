# SaaS Dental Chatbot – Template Base

Template reutilizável de site com chatbot integrado para clínicas odontológicas.
Cada cliente recebe um deploy próprio com suas informações personalizadas.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Vite + React + TailwindCSS |
| Backend | Vercel Serverless Functions (Node.js) |
| IA | OpenAI `gpt-4o-mini` |
| Banco | Nenhum na V1 (pronto para Supabase) |
| Deploy | Vercel |

---

## Estrutura do Projeto

```
/
├── api/
│   └── chat.js              # Serverless function – endpoint /api/chat
├── src/
│   ├── components/
│   │   ├── ChatWidget.jsx   # Bolha flutuante + controle de abertura
│   │   ├── ChatWindow.jsx   # Modal de chat – lista de mensagens + input
│   │   └── MessageBubble.jsx # Balão individual + CTA WhatsApp
│   ├── data/
│   │   ├── clinic.json      # Configuração da clínica (personalizar por cliente)
│   │   └── faq.json         # Base de perguntas frequentes
│   ├── pages/
│   │   └── Home.jsx         # Landing page completa
│   ├── utils/
│   │   ├── buildPrompt.js   # Geração do system prompt + matching de FAQ
│   │   └── rateLimiter.js   # Rate limit por IP e por sessão (in-memory)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── tooth.svg
├── .env.example             # Variáveis de ambiente necessárias
├── vercel.json              # Configuração de deploy Vercel
├── dev-server.js            # Servidor local para testar a API
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Personalizar para um Novo Cliente

Edite **apenas** o arquivo `src/data/clinic.json`:

```json
{
  "name": "Nome da Clínica",
  "primaryColor": "#0ea5e9",
  "primaryColorDark": "#0284c7",
  "primaryColorLight": "#e0f2fe",
  "whatsapp": "5511999999999",
  "address": { ... },
  "hours": { ... },
  "services": [ ... ],
  "insurances": [ ... ]
}
```

O site adapta automaticamente cores, nome, serviços e todos os CTAs.

---

## Configuração Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local e adicione sua OPENAI_API_KEY
```

### 3. Rodar em desenvolvimento

Terminal 1 – Frontend:
```bash
npm run dev
```

Terminal 2 – API local:
```bash
node dev-server.js
```

Acesse: `http://localhost:5173`

---

## Deploy na Vercel

### Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primeiro deploy = configuração interativa)
vercel

# Deploy para produção
vercel --prod
```

### Via GitHub (recomendado)

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Importe o repositório
4. Em **Environment Variables**, adicione:
   - `OPENAI_API_KEY` = sua chave da OpenAI
5. Clique em **Deploy**

### Variáveis de ambiente obrigatórias na Vercel

| Variável | Descrição |
|----------|-----------|
| `OPENAI_API_KEY` | Chave da API OpenAI (obrigatória) |

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
  │  POST /api/chat
  ▼
api/chat.js (Vercel Serverless)
  │
  ├─► Sanitizar input
  ├─► Rate limit por IP (in-memory)
  ├─► Limit por sessão (in-memory)
  ├─► Buscar FAQ (zero custo)
  │     └─ match encontrado → retorna direto
  └─► OpenAI gpt-4o-mini (fallback)
        max_tokens: 300
        histórico: últimas 5 trocas
```

### Controle de custo

- Máximo **300 tokens** por resposta
- Histórico limitado a **5 pares** de mensagens
- **FAQ matching** evita chamar a IA para perguntas comuns
- Rate limit: **30 req/min por IP**, bloqueio por 5 min se exceder
- Sessão: máximo de **20 mensagens**

---

## Roadmap V2 (Multi-tenant)

- [ ] Supabase para persistência de conversas
- [ ] Dashboard admin por clínica
- [ ] Logs de uso por tenant_id
- [ ] Controle de quota por cliente
- [ ] Webhook para notificar recepção de novos leads

---

## Segurança

- API key nunca exposta no frontend
- Input sanitizado contra prompt injection
- Headers de segurança via `vercel.json`
- Sem armazenamento de dados pessoais na V1
