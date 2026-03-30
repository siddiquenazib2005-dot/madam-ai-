// ════════════════════════════════════════
// ROUTES
// All API endpoints defined here
// File: routes/chatRoutes.js
// ════════════════════════════════════════

const express = require("express");
const router  = express.Router();
const { handleChat, handleClearMemory, handleGetMemory } = require("../controllers/chatController");

// POST /api/chat — main chat endpoint
router.post("/chat", handleChat);

// POST /api/memory/clear — clear user memory
router.post("/memory/clear", handleClearMemory);

// GET /api/memory/:userId — get user memory
router.get("/memory/:userId", handleGetMemory);

module.exports = router;
