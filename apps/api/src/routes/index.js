const express = require("express");
const authRoutes = require("./auth.routes");
const aiRoutes = require("./ai.routes");
const scoreRoutes = require("./score.routes");

const router = express.Router();

// Mount routes
router.use("/", authRoutes);
router.use("/", aiRoutes);
router.use("/", scoreRoutes);

// Also mount under /api/v1 for enterprise REST conventions
router.use("/api/v1", authRoutes);
router.use("/api/v1", aiRoutes);
router.use("/api/v1", scoreRoutes);

module.exports = router;
