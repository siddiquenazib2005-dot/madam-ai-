// ════════════════════════════════════════
// TOOL SERVICE
// All external API tools live here
// File: services/toolService.js
// ════════════════════════════════════════

const axios = require("axios");
require("dotenv").config();

// ── WEATHER ──────────────────────────────
// Gets current weather for a city
async function weather(city = "Delhi") {
  try {
    const key = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const res = await axios.get(url, { timeout: 5000 });
    const d = res.data;
    return {
      city: d.name,
      temp: d.main.temp,
      feels_like: d.main.feels_like,
      description: d.weather[0].description,
      humidity: d.main.humidity,
      wind: d.wind.speed,
    };
  } catch (e) {
    return { error: "Could not fetch weather. Check city name or API key." };
  }
}

// ── NEWS ─────────────────────────────────
// Gets top headlines (India by default)
async function news(query = "India") {
  try {
    const key = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=5&apiKey=${key}`;
    const res = await axios.get(url, { timeout: 5000 });
    const articles = res.data.articles || [];
    return articles
      .filter((a) => a.title && !a.title.includes("[Removed]"))
      .slice(0, 5)
      .map((a) => ({ title: a.title, source: a.source.name }));
  } catch (e) {
    return { error: "Could not fetch news. Check API key." };
  }
}

// ── CALCULATE ────────────────────────────
// Safe math expression evaluator
function calculate(expression) {
  try {
    // Only allow safe math characters
    const clean = expression.replace(/[^0-9+\-*/().,% ]/g, "").replace(/%/g, "/100");
    if (!clean.trim()) return { error: "Invalid expression" };
    const result = Function('"use strict"; return (' + clean + ")")();
    return { expression, result };
  } catch (e) {
    return { error: "Could not calculate. Check the expression." };
  }
}

// ── SEARCH WEB ───────────────────────────
// Google search via Serper API
async function searchWeb(query) {
  try {
    const key = process.env.SERPER_API_KEY;
    const res = await axios.post(
      "https://google.serper.dev/search",
      { q: query, num: 5 },
      {
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        timeout: 5000,
      }
    );
    const results = res.data.organic || [];
    return results.slice(0, 4).map((r) => ({
      title: r.title,
      snippet: r.snippet,
      link: r.link,
    }));
  } catch (e) {
    return { error: "Search failed. Check Serper API key." };
  }
}

// ── FORMAT TOOL RESULT ───────────────────
// Converts tool output to readable string for AI context
function formatToolResult(toolName, result) {
  if (!result || result.error) return "";

  if (toolName === "weather") {
    return `[WEATHER] ${result.city}: ${result.temp}°C (feels ${result.feels_like}°C), ${result.description}, Humidity: ${result.humidity}%, Wind: ${result.wind} km/h`;
  }
  if (toolName === "news") {
    const headlines = Array.isArray(result)
      ? result.map((a, i) => `${i + 1}. ${a.title} (${a.source})`).join("\n")
      : "No news found.";
    return `[NEWS]\n${headlines}`;
  }
  if (toolName === "calculate") {
    return `[CALC] ${result.expression} = ${result.result}`;
  }
  if (toolName === "searchWeb") {
    const items = Array.isArray(result)
      ? result.map((r) => `- ${r.title}: ${r.snippet}`).join("\n")
      : "No results.";
    return `[SEARCH]\n${items}`;
  }
  return JSON.stringify(result);
}

module.exports = { weather, news, calculate, searchWeb, formatToolResult };
