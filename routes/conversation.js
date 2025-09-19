const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/', authenticateToken, conversationController.chatWithAI);
router.get('/', authenticateToken, conversationController.getConversations);


module.exports = router;    