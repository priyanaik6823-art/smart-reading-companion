const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI Reading Assistant for a Smart Reading Companion app.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "AI response failed",
    });
  }
});

module.exports = router;