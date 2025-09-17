const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Import routes
const moodRoutes = require('./routes/moods');
const userRoutes = require('./routes/users');
const quoteRoutes = require('./routes/quotes');
const conversationRoutes = require('./routes/conversation');

// Use routes
app.use('/', userRoutes); // signup, login, profile
app.use('/api/moods', moodRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/chat', conversationRoutes);


const PORT = process.env.PORT;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`MoodLogger app running at http://localhost:${PORT}`);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
});
