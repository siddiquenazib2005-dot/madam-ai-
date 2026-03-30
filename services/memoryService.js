// ════════════════════════════════════════
// MEMORY SERVICE
// Saves all conversation messages per user
// File: services/memoryService.js
// ════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../memory/memory.json");

// Load memory from disk
function loadMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      fs.writeFileSync(MEMORY_FILE, "{}");
    }
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));
  } catch (e) {
    console.error("[Memory] Load error:", e.message);
    return {};
  }
}

// Write memory to disk
function writeToDisk(data) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("[Memory] Write error:", e.message);
  }
}

// Save a single message
// role: "user" or "assistant"
function saveMessage(userId, role, content) {
  const memory = loadMemory();
  if (!memory[userId]) memory[userId] = [];
  memory[userId].push({ role, content, time: Date.now() });
  writeToDisk(memory);
}

// Get full conversation history for a user
// Returns array of { role, content } objects
function getHistory(userId) {
  const memory = loadMemory();
  return (memory[userId] || []).map(({ role, content }) => ({ role, content }));
}

// Clear all history for a user
function clearHistory(userId) {
  const memory = loadMemory();
  memory[userId] = [];
  writeToDisk(memory);
}

module.exports = { saveMessage, getHistory, clearHistory };
