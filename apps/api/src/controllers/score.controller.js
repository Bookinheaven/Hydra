const prisma = require("../config/prisma");

const createScore = async (req, res) => {
  const { wpm, accuracy, mode, modeValue } = req.body;
  if (typeof wpm !== 'number' || typeof accuracy !== 'number' || !mode || !modeValue) {
    return res.status(400).json({ error: "Missing required score fields" });
  }
  // Ignore buggy 0 WPM test runs
  if (wpm <= 0) {
    return res.status(400).json({ error: "Score must be greater than 0 WPM to save" });
  }
  try {
    const score = await prisma.score.create({
      data: {
        userId: req.user.userId,
        wpm: Math.round(wpm),
        accuracy: Number(accuracy),
        mode: String(mode),
        modeValue: String(modeValue),
      }
    });
    res.status(201).json({ score });
  } catch (error) {
    console.error("Create Score Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyScores = async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ scores });
  } catch (error) {
    console.error("Get My Scores Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const allScores = await prisma.score.findMany({
      where: { wpm: { gt: 0 } },
      orderBy: { wpm: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    // Deduplicate leaderboard entries by username: each user appears only once with their personal best score!
    const userBestMap = new Map();
    for (const score of allScores) {
      const username = score.user?.username || `user-${score.userId}`;
      if (!userBestMap.has(username)) {
        userBestMap.set(username, score);
      }
    }

    const topScores = Array.from(userBestMap.values()).slice(0, 20);
    res.json({ scores: topScores });
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createScore, getMyScores, getLeaderboard };
