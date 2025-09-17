const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const moodsController = require('../controllers/moodsController');

router.post('/', authenticateToken, moodsController.addMood);
router.get('/', authenticateToken, moodsController.getMoods);
router.get('/weekly', authenticateToken, moodsController.getWeeklyMoods);
router.get('/monthly', authenticateToken, moodsController.getMonthlyMoods);
router.delete('/:id', authenticateToken, moodsController.deleteMood);

module.exports = router;