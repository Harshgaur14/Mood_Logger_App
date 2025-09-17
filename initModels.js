const sequelize = require('./db');
const User = require('./models/User');
const Moods = require('./models/Moods');
const Quotes = require('./models/Quotes');
const Conversations = require('./models/Conversations');

// Associations
User.hasMany(Moods, { foreignKey: 'userId' });
Moods.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Conversations, { foreignKey: 'userId' });
Conversations.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully with all models and associations.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error syncing database:', err);
        process.exit(1);
    });
