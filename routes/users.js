const express = require('express');
const authenticateToken = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Signup
router.post('/signup', userController.signup);

// Login
router.post('/login', userController.login);

// Profile (protected)
router.get('/profile', authenticateToken, userController.profile);

module.exports = router;
