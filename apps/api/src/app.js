const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { CLIENT_ORIGIN } = require("./config/env");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_ORIGIN, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// API Routes
app.use("/", routes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
