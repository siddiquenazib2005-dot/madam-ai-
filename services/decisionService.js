// ════════════════════════════════════════
// DECISION ENGINE
// Analyzes user input and decides what to do
// File: services/decisionService.js
// ════════════════════════════════════════

// ── AGENT KEYWORDS ───────────────────────
const AGENT_KEYWORDS = {
  coder: [
    "code", "program", "function", "debug", "error", "script",
    "python", "javascript", "html", "css", "node", "react",
    "bug", "fix", "write a", "build a", "create a function",
    "banana hai", "likho", "banao", "compile",
  ],
  research: [
    "search", "find", "look up", "who is", "what is", "tell me about",
    "explain", "history of", "define", "research", "google",
    "wikipedia", "ke baare mein", "kya hota hai", "kaun hai",
  ],
};

// ── TOOL KEYWORDS ────────────────────────
const TOOL_KEYWORDS = {
  weather: [
    "weather", "temperature", "mausam", "garmi", "sardi",
    "rain", "barish", "forecast", "humidity", "wind",
  ],
  news: [
    "news", "headline", "khabar", "samachar", "breaking",
    "latest", "today's news", "aaj ki news",
  ],
  calculate: [
    "calculate", "calc", "kitna hoga", "solve", "math",
    "+", "-", "*", "/", "percent", "%", "sum of",
  ],
  searchWeb: [
    "search for", "google", "find me", "look up", "web search",
    "search karo", "dhundo",
  ],
  imageGen: [
    "generate image", "create image", "draw", "make image",
    "image of", "picture of", "tasveer", "image banao",
  ],
};

// ── MAIN DECISION FUNCTION ───────────────
// Returns: { type: "tool"|"agent"|"chat", value: string, toolArgs: any }
function decide(userMessage) {
  const msg = userMessage.toLowerCase();

  // 1. Check for tool triggers first
  for (const [toolName, keywords] of Object.entries(TOOL_KEYWORDS)) {
    for (const kw of keywords) {
      if (msg.includes(kw)) {
        // Extract city for weather
        let toolArgs = null;
        if (toolName === "weather") {
          const match = msg.match(/(?:in|at|for|of|mein)\s+([a-zA-Z\u0900-\u097F]+)/);
          toolArgs = match ? match[1] : "Delhi";
        }
        // Extract math expression for calculate
        if (toolName === "calculate") {
          toolArgs = userMessage.replace(/calculate|calc|solve|kitna hoga/gi, "").trim();
        }
        // Extract search query
        if (toolName === "searchWeb") {
          toolArgs = userMessage.replace(/search for|google|find me|look up|search karo|dhundo/gi, "").trim();
        }
        // Extract image prompt
        if (toolName === "imageGen") {
          toolArgs = userMessage
            .replace(/generate image|create image|draw|make image|image of|picture of|tasveer|image banao/gi, "")
            .trim();
        }
        return { type: "tool", value: toolName, toolArgs };
      }
    }
  }

  // 2. Check for agent triggers
  for (const [agentName, keywords] of Object.entries(AGENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (msg.includes(kw)) {
        return { type: "agent", value: agentName };
      }
    }
  }

  // 3. Default → general assistant chat
  return { type: "chat", value: "assistant" };
}

module.exports = { decide };
