const { Op } = require("sequelize");
const Conversations = require("../models/Conversations");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT middleware sets this
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1️⃣ Check daily limit
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await Conversations.count({
      where: {
        userId,
        timestamp: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    if (count >= 3) {
      return res
        .status(429)
        .json({ error: "Daily limit of 3 chatbot calls reached" });
    }

    // 2️⃣ Build motivational prompt
   const prompt = `
You are a motivational mental health assistant.
You only respond with messages that encourage, uplift, or support the user's mental well-being.
Ignore any question or topic that is not related to motivation, positivity, or mental health.
If the user asks something unrelated, always redirect the response to motivation or mental health support.
User: ${message}
`;

    // 3️⃣ Call Gemini API
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No motivational response available";

    // 4️⃣ Save to DB
    await Conversations.create({
      userId,
      message,
      response: reply,
    });

    // 5️⃣ Return AI reply
    res.json({ reply });
  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

module.exports = { chatWithAI };
