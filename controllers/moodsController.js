const { Op, fn, col, literal } = require('sequelize');
const Moods = require('../models/Moods');

// Add mood
exports.addMood = async (req, res) => {
    try {
        const { moodType, note } = req.body;
        if (!moodType) {
            return res.status(400).json({ message: 'Mood type is required' });
        }
        const mood = await Moods.create({
            userId: req.user.userId,
            moodType,
            note
        });
        res.status(201).json({ message: 'Mood added successfully', mood });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get moods
exports.getMoods = async (req, res) => {
    try {
        const moods = await Moods.findAll({
            where: { userId: req.user.userId },
            order: [['timestamp', 'DESC']]
        });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Weekly grouped
exports.getWeeklyMoods = async (req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        const moods = await Moods.findAll({
            attributes: [
                [fn('DATE', col('timestamp')), 'day'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                userId: req.user.userId,
                timestamp: { [Op.between]: [weekAgo, today] }
            },
            group: [fn('DATE', col('timestamp'))],
            order: [[literal('day'), 'ASC']]
        });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Monthly grouped
exports.getMonthlyMoods = async (req, res) => {
    try {
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);

        const moods = await Moods.findAll({
            attributes: [
                [fn('DATE', col('timestamp')), 'day'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                userId: req.user.userId,
                timestamp: { [Op.between]: [monthAgo, today] }
            },
            group: [fn('DATE', col('timestamp'))],
            order: [[literal('day'), 'ASC']]
        });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//  Delete mood
exports.deleteMood = async (req, res) => {
    try {
        const { id } = req.params;
        const mood = await Moods.findOne({
            where: { id, userId: req.user.userId }
        });
        if (!mood) return res.status(404).json({ message: 'Mood not found' });

        await mood.destroy();
        res.json({ message: 'Mood deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
