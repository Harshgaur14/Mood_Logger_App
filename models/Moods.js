const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Moods = sequelize.define('Moods', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    moodType: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'moods',
    timestamps: false,
});

module.exports = Moods;
