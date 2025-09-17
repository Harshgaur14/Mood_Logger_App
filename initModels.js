const sequelize = require('./db');
const User = require('./models/User');
const Moods = require('./models/Moods');

// Define associations after both models are loaded
User.hasMany(Moods, { foreignKey: 'userId' });
Moods.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synced successfully with proper associations.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error syncing database:', err);
        process.exit(1);
    });
