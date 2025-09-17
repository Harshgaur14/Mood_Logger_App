const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Import routes
const moodRoutes = require('./routes/moods');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/moods', moodRoutes);
app.use('/', userRoutes); // signup, login, profile

const PORT = 3001;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`MoodLogger app running at http://localhost:${PORT}`);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
});
