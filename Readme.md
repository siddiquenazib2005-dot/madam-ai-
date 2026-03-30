# MADAM AI — Node.js Backend

My Adaptive Digital Assistant & Manager

## Folder Structure

```
backend/
├── server.js              ← Entry point
├── package.json
├── .env.example           ← Copy to .env and fill keys
├── public/
│   └── index.html         ← Frontend UI
├── routes/
│   └── chatRoutes.js      ← API endpoints
├── controllers/
│   └── chatController.js  ← Main logic (ties everything)
├── services/
│   ├── memoryService.js   ← Saves all messages per user
│   ├── decisionService.js ← Decides tool/agent/chat
│   ├── agentService.js    ← Returns right system prompt
│   ├── toolService.js     ← Weather, news, calc, search
│   └── aiService.js       ← Connects to Grok API
├── agents/
│   ├── assistantAgent.js  ← General chat personality
│   ├── coderAgent.js      ← Coding expert
│   └── researchAgent.js   ← Research & facts
└── memory/
    └── memory.json        ← Auto-created, stores all chats
```

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```
Fill in your API keys:
- `GROK_API_KEY` → from https://console.x.ai
- `WEATHER_API_KEY` → from https://openweathermap.org (free)
- `NEWS_API_KEY` → from https://newsapi.org (free)
- `SERPER_API_KEY` → from https://serper.dev (free tier)

### 3. Run
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

### 4. Open
```
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Main chat endpoint |
| POST | /api/memory/clear | Clear user memory |
| GET  | /api/memory/:userId | Get user memory |
| GET  | /ping | Health check |

### Chat Request
```json
POST /api/chat
{
  "message": "Delhi ka weather batao",
  "userId": "user_1",
  "agent": "assistant"
}
```

### Chat Response
```json
{
  "reply": "Sir, Delhi mein abhi 32°C hai...",
  "agent": "research",
  "tool": "weather",
  "imageUrl": null
}
```

## Deploy to Render

1. Push to GitHub
2. New Web Service on render.com
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables
6. Deploy!
