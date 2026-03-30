// ════════════════════════════════════════
// CHAT CONTROLLER
// Ties everything together:
// Memory → Decision → Agent/Tool → AI → Response
// File: controllers/chatController.js
// ════════════════════════════════════════

const memoryService  = require("../services/memoryService");
const decisionService = require("../services/decisionService");
const agentService   = require("../services/agentService");
const toolService    = require("../services/toolService");
const aiService      = require("../services/aiService");

async function handleChat(req, res) {
  try {
    const { message, userId = "default" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ── STEP 1: Decide what to do ──────────
    const decision = decisionService.decide(message);
    console.log(`[Decision] type=${decision.type}, value=${decision.value}`);

    // ── STEP 2: Run tool if needed ─────────
    let toolContext = "";
    let toolUsed    = null;
    let imageUrl    = null;

    if (decision.type === "tool") {
      toolUsed = decision.value;

      if (toolUsed === "imageGen") {
        // Image generation via Pollinations (free, no key needed)
        const prompt = encodeURIComponent(decision.toolArgs || message);
        imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;
        // Save and return image directly
        memoryService.saveMessage(userId, "user", message);
        memoryService.saveMessage(userId, "assistant", `[Image generated: ${decision.toolArgs}]`);
        return res.json({
          reply: `Sir, here's the image you requested for "${decision.toolArgs}".`,
          imageUrl,
          tool: "imageGen",
        });
      }

      // Run the appropriate tool
      let toolResult;
      if (toolUsed === "weather")    toolResult = await toolService.weather(decision.toolArgs);
      else if (toolUsed === "news")  toolResult = await toolService.news();
      else if (toolUsed === "calculate") toolResult = toolService.calculate(decision.toolArgs);
      else if (toolUsed === "searchWeb") toolResult = await toolService.searchWeb(decision.toolArgs || message);

      toolContext = toolService.formatToolResult(toolUsed, toolResult);
    }

    // ── STEP 3: Pick the right agent ───────
    const agentName =
      decision.type === "agent"  ? decision.value :
      decision.type === "tool"   ? "research"     :
      "assistant";

    const systemPrompt = agentService.getSystemPrompt(agentName);

    // ── STEP 4: Load memory ────────────────
    const history = memoryService.getHistory(userId);

    // ── STEP 5: Call Grok AI ───────────────
    const reply = await aiService.chat(systemPrompt, history, message, toolContext);

    // ── STEP 6: Save to memory ─────────────
    memoryService.saveMessage(userId, "user",      message);
    memoryService.saveMessage(userId, "assistant", reply);

    // ── STEP 7: Return response ────────────
    return res.json({
      reply,
      agent: agentName,
      tool:  toolUsed || null,
    });

  } catch (e) {
    console.error("[Chat Controller] Error:", e.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Clear memory for a user
function handleClearMemory(req, res) {
  const { userId = "default" } = req.body;
  memoryService.clearHistory(userId);
  return res.json({ success: true, message: "Memory cleared." });
}

// Get memory for a user
function handleGetMemory(req, res) {
  const userId = req.params.userId || "default";
  const history = memoryService.getHistory(userId);
  return res.json({ userId, messages: history });
}

module.exports = { handleChat, handleClearMemory, handleGetMemory };
