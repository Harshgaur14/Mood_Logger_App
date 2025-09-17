const express = require('express');
const quotesController = require('../controllers/quotesController');

const router = express.Router();

router.get('/today', quotesController.getTodayQuote);

module.exports = router;