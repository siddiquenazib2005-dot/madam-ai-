// ════════════════════════════════════════
// AGENT SERVICE
// Returns the right system prompt for each agent
// File: services/agentService.js
// ════════════════════════════════════════

const assistantAgent = require("../agents/assistantAgent");
const coderAgent = require("../agents/coderAgent");
const researchAgent = require("../agents/researchAgent");

// Map agent name → system prompt
const AGENTS = {
  assistant: assistantAgent.systemPrompt,
  coder:     coderAgent.systemPrompt,
  research:  researchAgent.systemPrompt,
};

// Get system prompt for a given agent name
function getSystemPrompt(agentName = "assistant") {
  return AGENTS[agentName] || AGENTS.assistant;
}

module.exports = { getSystemPrompt };
