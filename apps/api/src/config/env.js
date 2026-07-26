require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-do-not-use-in-prod",
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/api/generate/",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
