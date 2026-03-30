// ════════════════════════════════════════
// SERVER.JS — Entry Point
// Madam AI Backend
// ════════════════════════════════════════

require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const rateLimit  = require("express-rate-limit");
const path       = require("path");
const chatRoutes = require("./routes/chatRoutes");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// Rate limiting — 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests. Please slow down." },
});
app.use("/api", limiter);

// ── ROUTES ────────────────────────────────
app.use("/api", chatRoutes);

// Health check
app.get("/ping", (req, res) => {
  res.json({ status: "alive", system: "Madam AI", version: "1.0" });
});

// Serve frontend index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── START ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✨ Madam AI Backend running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/ping`);
  console.log(`   Chat:   POST http://localhost:${PORT}/api/chat\n`);
});

module.exports = app;
