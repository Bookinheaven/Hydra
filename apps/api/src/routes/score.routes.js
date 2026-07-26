const express = require("express");
const { createScore, getMyScores, getLeaderboard } = require("../controllers/score.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/scores", authenticateToken, createScore);
router.get("/scores/me", authenticateToken, getMyScores);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
