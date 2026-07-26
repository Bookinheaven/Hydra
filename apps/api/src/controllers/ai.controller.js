const axios = require("axios");
const { AI_SERVICE_URL } = require("../config/env");

const FALLBACK_CORPUS = [
  "Artificial intelligence is transforming the way we interact with technology on a daily basis.",
  "The typing engine is designed for extreme speed and zero lag, ensuring a seamless experience.",
  "FastAPI is a modern, fast, web framework for building APIs with Python based on standard Python type hints.",
  "In the future, adaptive algorithms will automatically detect your weak keys and generate customized practice.",
  "Programming is not about typing fast, but about thinking clearly and solving complex problems efficiently.",
  "A clean architecture strictly separates business logic from the user interface, leading to maintainable code.",
  "Consistent practice builds muscle memory and helps you achieve incredible speeds with precision."
];

const generatePassage = async (req, res) => {
  const { letters, words = 50, length } = req.body;
  try {
    const response = await axios.post(AI_SERVICE_URL, { 
      letters,
      words,
      length
    }, { timeout: 2500 });
    res.json(response.data);
  } catch (err) {
    console.warn("FastAPI offline or timed out. Using Node.js AI adaptive fallback generator.");
    const passageWords = [];
    while (passageWords.length < words) {
      const sentence = FALLBACK_CORPUS[Math.floor(Math.random() * FALLBACK_CORPUS.length)];
      passageWords.push(...sentence.split(" "));
    }
    const final_text = passageWords.slice(0, words).join(" ");
    res.json({ text: final_text });
  }
};

module.exports = { generatePassage };
