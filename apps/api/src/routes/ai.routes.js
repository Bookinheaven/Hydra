const express = require("express");
const { generatePassage } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/generate", generatePassage);

module.exports = router;
