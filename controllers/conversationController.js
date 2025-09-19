const { Op } = require("sequelize");
const Conversations = require("../models/Conversations");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    //  Daily limit check
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await Conversations.count({
      where: {
        userId,
        timestamp: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    if (count >= 4) {
      return res
        .status(429)
        .json({ error: "Daily limit of 5 chatbot calls reached" });
    }

    //  Build motivational prompt
  const prompt = `
You are a motivational mental health assistant.
Your only purpose is to encourage, uplift, and support the user's mental well-being.
- Keep every response focused on motivation, positivity, self-growth, or mental health.
- If the user asks something unrelated (e.g., cooking, coding, trivia), you must redirect the conversation back to motivation or mental health using gentle analogies or uplifting reflections.
- Use a warm, compassionate, and supportive tone in every reply.
- Do not provide factual answers about unrelated topics; always reframe them as life lessons, encouragement, or reflections on self-care.
User: ${message}
`;

    //  Call OpenAI API
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ cost-efficient model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Stay strong, keep believing in yourself!";

    //  Save conversation
    await Conversations.create({
      userId,
      message,
      response: reply,
    });

    res.json({ reply });
  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversations.findAll({
      where: { userId },
      order: [["timestamp", "DESC"]], // latest first
    });

    res.json({ conversations });
  } catch (err) {
    console.error("Get Conversations Error:", err.message);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

module.exports = { chatWithAI, getConversations };
