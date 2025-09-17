const axios = require("axios");
const https = require("https");
const Quotes = require("../models/Quotes");
const { Op } = require("sequelize");

// Ignore SSL issues
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

exports.getTodayQuote = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 1️⃣ Check if today's quote already exists
    const existingQuote = await Quotes.findOne({
      where: { dateFetched: { [Op.between]: [startOfDay, endOfDay] } },
    });
    if (existingQuote) return res.json(existingQuote);

    // 2️⃣ Fetch a new quote (loop until unique one is found)
    let newQuoteData = null;
    let duplicate = null;

    do {
      const response = await axios.get("https://api.quotable.io/random", {
        httpsAgent,
      });
      newQuoteData = response.data;

      // check if content already exists in DB (any date)
      duplicate = await Quotes.findOne({ where: { content: newQuoteData.content } });
    } while (duplicate); // keep fetching until it's unique

    // 3️⃣ Store unique quote
    const newQuote = await Quotes.create({
      content: newQuoteData.content,
      author: newQuoteData.author,
      dateFetched: new Date(),
    });

    res.json(newQuote);
  } catch (err) {
    console.error("Error fetching quote:", err.message);
    res.status(500).json({ message: "Failed to fetch quote" });
  }
};
