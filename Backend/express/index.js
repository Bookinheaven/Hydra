const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:5000/generate", req.body);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "AI generation failed" });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
