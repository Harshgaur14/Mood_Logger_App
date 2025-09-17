const OpenAI = require("openai");
const Conversations = require("../models/Conversations");
const { Op } = require("sequelize");
require("dotenv").config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.chatWithAI = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 1️⃣ Check today's conversation count for user
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const convoCount = await Conversations.count({
      where: {
        userId,
        timestamp: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    if (convoCount >= 5) {
      return res
        .status(429)
        .json({ message: "Daily limit of 5 chatbot calls reached" });
    }

    // 2️⃣ Call OpenAI GPT-5 API (focus on motivation/mental health)
    const aiResponse = await client.responses.create({
      model: "gpt-5",
      input: `You are a motivational mental health assistant. Respond to the user with encouragement and positivity.\nUser: ${message}`,
      max_output_tokens: 200,
    });

    // Extract text from the new API response format
    const responseText =
      aiResponse.output_text || aiResponse.output?.[0]?.content?.[0]?.text || "";

    // 3️⃣ Save conversation in DB
    await Conversations.create({
      userId,
      message,
      response: responseText,
    });

    // 4️⃣ Return AI response
    res.json({ message: responseText });
  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    res.status(500).json({ message: "Failed to get AI response" });
  }
};
