const express = require("express");
const cors = require("cors");
const { getCryptoData } = require("./tools/cryptoTool");
require('dotenv').config();
const {askAI} = require('./ai.js');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/api/ai', async (req, res) => {
  try {
    const question = req.query.question;
    const answer = await askAI(question);

    res.json({
      answer
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/crypto/:coin", async (req, res) => {
  try {
    const data = await getCryptoData(req.params.coin);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send({
    message: "Crypto Analysis Agent Backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});