const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/', authenticateToken, conversationController.chatWithAI);

module.exports = router;    