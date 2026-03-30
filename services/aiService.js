// ════════════════════════════════════════
// AI SERVICE
// Connects to Grok API (xAI)
// File: services/aiService.js
// ════════════════════════════════════════

const axios = require("axios");
require("dotenv").config();

const GROK_URL  = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-3-latest";

// ── MAIN CHAT FUNCTION ───────────────────
// systemPrompt : agent's personality
// history      : past messages from memory
// userMessage  : current user input
// toolContext  : optional tool result string
async function chat(systemPrompt, history, userMessage, toolContext = "") {
  try {
    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
      ...history, // inject full memory
    ];

    // If tool result exists, prepend to user message
    const finalUserMsg = toolContext
      ? `${toolContext}\n\nUser: ${userMessage}`
      : userMessage;

    messages.push({ role: "user", content: finalUserMsg });

    const res = await axios.post(
      GROK_URL,
      {
        model: GROK_MODEL,
        messages,
        temperature: 0.75,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 25000,
      }
    );

    const reply = res.data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Empty response from Grok");
    return reply.trim();

  } catch (e) {
    console.error("[AI Service] Error:", e.response?.data || e.message);
    // Return friendly error
    if (e.response?.status === 401) return "Sir, API key seems invalid. Please check configuration.";
    if (e.response?.status === 429) return "Sir, too many requests. Please wait a moment.";
    return "Sir, I'm having trouble connecting right now. Please try again.";
  }
}

module.exports = { chat };
