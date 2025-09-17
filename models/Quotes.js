const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Quotes = sequelize.define('Quotes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    dateFetched: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        unique: true
    }
}, {
    tableName: 'quotes',
    timestamps: false,
});

module.exports = Quotes;
