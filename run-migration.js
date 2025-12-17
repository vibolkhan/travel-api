const sequelize = require('./src/config/database');
const migration = require('./src/migrations/20251217000000-add-rooms');

(async () => {
    try {
        console.log('Running migration: add-rooms');
        await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
        console.log('✓ Migration completed successfully');

        // Verify tables
        const [roomsTable] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='rooms'");
        console.log('✓ Rooms table exists:', roomsTable.length > 0);

        const [bookingsInfo] = await sequelize.query("PRAGMA table_info(bookings)");
        const hasRoomId = bookingsInfo.some(col => col.name === 'roomId');
        console.log('✓ Bookings.roomId column exists:', hasRoomId);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
})();
