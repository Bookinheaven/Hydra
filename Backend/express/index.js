const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

app.post("/generate", async (req, res) => {
    const { letters, words, length } = req.body;
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/generate/", { 
            letters,
            words,
            length
        });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "FastAPI server not responding" });
    }
});

app.listen(5000, () => {
  console.log("Express server running on http://localhost:5000");
});
