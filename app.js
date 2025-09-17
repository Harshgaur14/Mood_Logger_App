// app.js
const express = require('express');
const pool = require('./db');

const app = express();
const port = 3001;

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Welcome to MoodLogger! Database time: ${result.rows[0].now}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error');
    }
});

app.listen(port, () => {
    console.log(`MoodLogger app running at http://localhost:${port}`);
});
