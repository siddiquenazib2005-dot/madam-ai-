// ════════════════════════════════════════
// AI SERVICE
// Connects to Groq API (fast & free)
// Location: services/aiService.js
// ════════════════════════════════════════

const axios = require("axios");
require("dotenv").config();

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Send message to Groq and get response
// systemPrompt : agent personality
// history      : past messages from memory
// userMessage  : current user input
// toolContext  : optional formatted tool result
async function chat(systemPrompt, history, userMessage, toolContext = "") {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
    ];

    // Prepend tool result to user message if available
    const finalMsg = toolContext
      ? `${toolContext}\n\nUser query: ${userMessage}`
      : userMessage;

    messages.push({ role: "user", content: finalMsg });

    const res = await axios.post(
      GROQ_URL,
      {
        model:       GROQ_MODEL,
        messages,
        temperature: 0.75,
        max_tokens:  1024,
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 25000,
      }
    );

    const reply = res.data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Empty response");
    return reply.trim();

  } catch (e) {
    console.error("[AI] Error:", e.response?.data || e.message);
    if (e.response?.status === 401)
      return "Sir, the API key seems invalid. Please check configuration.";
    if (e.response?.status === 429)
      return "Sir, too many requests. Please wait a moment and try again.";
    return "Sir, I'm having trouble connecting right now. Please try again shortly.";
  }
}

module.exports = { chat };
