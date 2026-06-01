# SupportAI — AI Customer Support Chat

A full-stack AI-powered customer support chat application. Built with React 19 on the frontend and Node.js/Express on the backend, with MongoDB for conversation persistence and OpenRouter (GPT-4o-mini) as the AI layer.

**Live Demo → [support-ai-chat-tins.vercel.app/chat](https://support-ai-chat-tins.vercel.app/chat)**

---

## Features

- **AI-powered responses** — GPT-4o-mini via OpenRouter, scoped to billing, account management, and technical support queries
- **Persistent conversation threads** — every chat is saved to MongoDB; full history is passed to the LLM on each turn for accurate multi-turn context
- **Thread sidebar** — browse recent conversations, switch between threads, or delete them
- **Optimistic UI** — user messages render instantly before the server responds
- **Animated typing indicator** — shown while the AI is generating a reply
- **Quick-chip shortcuts** — one-click prompts for common queries (Reset password, Billing issue, Technical help, Talk to a human)
- **Syntax-highlighted responses** — AI replies rendered via `react-markdown` + `rehype-highlight` + `highlight.js`
- **Auto-resizing textarea** — input box grows as you type, capped at 120px
- **Graceful error handling** — network failures surface an inline error banner without crashing the UI
- **Monorepo Vercel deployment** — frontend (static) and backend (Node serverless) built and deployed from the same repo

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router v6, CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| AI | OpenRouter API — `openai/gpt-4o-mini` |
| Markdown | react-markdown, rehype-highlight, highlight.js |
| IDs | uuid (v1) |
| Deployment | Vercel (monorepo) |

---

## Project Structure

```
supportAI-chat/
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Router — LandingPage (/) and ChatApp (/chat)
│   │   ├── ChatWindow.jsx     # Main chat UI, input, optimistic updates
│   │   ├── Sidebar.jsx        # Thread list, new chat, delete thread
│   │   ├── Chat.jsx           # Renders message history
│   │   ├── MyContext.jsx      # Shared state via React Context
│   │   ├── LandingPage.jsx    # Marketing landing page
│   │   └── *.css              # Component styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js              # Express app, CORS, MongoDB connection
│   ├── routes/
│   │   └── chat.js            # All 4 API endpoints
│   ├── models/
│   │   └── Thread.model.js    # Mongoose Thread + Message schema
│   ├── utils/
│   │   └── openai.js          # OpenRouter API call + system prompt
│   └── package.json
│
└── vercel.json                # Monorepo build + routing config
```

---

## API Reference

All endpoints are prefixed with `/api`.

### `GET /api/thread`
Returns all threads sorted by `updatedAt` descending.

**Response**
```json
[
  { "threadId": "abc-123", "title": "Reset my password", "updatedAt": "..." },
  ...
]
```

---

### `GET /api/thread/:threadId`
Returns the message array for a specific thread.

**Response**
```json
[
  { "role": "user", "content": "I can't log in", "timestamp": "..." },
  { "role": "assistant", "content": "Let me help with that...", "timestamp": "..." }
]
```

---

### `DELETE /api/thread/:threadId`
Deletes a thread and all its messages.

**Response**
```json
{ "message": "Thread deleted successfully" }
```

---

### `POST /api/chat`
Sends a message and returns the AI reply. Creates a new thread if `threadId` doesn't exist yet; the first 60 characters of the first message become the thread title.

**Request body**
```json
{
  "threadId": "abc-123",
  "messages": "My payment failed but I was still charged"
}
```

**Response**
```json
{ "reply": "I'm sorry to hear that. Let me look into this for you..." }
```

---

## Database Schema

```js
// Message (sub-document)
{
  role:      String,  // "user" | "assistant"
  content:   String,
  timestamp: Date
}

// Thread
{
  threadId:  String,  // unique, uuid-v1
  title:     String,  // first 60 chars of opening message
  messages:  [Message],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

### 1. Clone the repo

```bash
git clone https://github.com/NirupamChakraborty/supportAI-CHAT.git
cd supportAI-CHAT
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openrouter_api_key
PORT=3030
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
node server.js
```

Backend runs on `http://localhost:3030`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_BACKEND_URI=http://localhost:3030
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Deployment (Vercel)

The repo includes a `vercel.json` that builds both frontend and backend from the same repository.

```json
{
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/static-build" },
    { "src": "backend/server.js",     "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/server.js" },
    { "src": "/(.*)",     "dest": "frontend/$1" }
  ]
}
```

Set these environment variables in your Vercel project settings:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `OPENAI_API_KEY` | Your OpenRouter API key |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL |
| `VITE_BACKEND_URI` | Your Vercel backend URL |

---

## How the AI Layer Works

The system prompt in `backend/utils/openai.js` scopes the assistant to support topics only:

```
You are a helpful and friendly customer support assistant.
Your job is to assist users with their questions about account management,
billing, technical issues, and general product usage.
Be concise, empathetic, and solution-focused.
If you cannot resolve an issue, politely ask the user to contact
support@yourapp.com or escalate to a human agent.
Never make up information — if you are unsure, say so clearly.
```

On every `POST /api/chat` request, the full conversation history (all prior `role` + `content` pairs) is retrieved from MongoDB and sent to the LLM — this is what enables accurate multi-turn replies without the AI losing context.

---

## Customisation

| What | Where |
|---|---|
| Change AI behaviour / scope | `backend/utils/openai.js` — edit the `system` prompt |
| Add / change quick-chip shortcuts | `frontend/src/ChatWindow.jsx` — `QUICK_CHIPS` array |
| Swap AI model | `backend/utils/openai.js` — change `"openai/gpt-4o-mini"` to any OpenRouter model |
| Update support email | `ChatWindow.jsx` footer + system prompt |
| Colours / theme | `frontend/src/App.css` — CSS custom properties |

---

## Author

**Nirupam Chakraborty**
[LinkedIn](https://www.linkedin.com/in/nirupam-chakraborty-01a55b254/) · [GitHub](https://github.com/NirupamChakraborty) · [Portfolio](https://portfolio-beta-one-82.vercel.app/)
