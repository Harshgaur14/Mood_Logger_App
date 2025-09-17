// initModels.js
const sequelize = require('./db');
const User = require('./models/User');

sequelize.sync()
    .then(() => {
        console.log('✅ Database synced successfully. Users table created.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error syncing database:', err);
        process.exit(1);
    });
