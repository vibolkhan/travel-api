'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const { STRING, TEXT, BOOLEAN, DATE, INTEGER, FLOAT } = Sequelize;

        // Create rooms table
        await queryInterface.createTable('rooms', {
            id: {
                type: STRING,
                primaryKey: true
            },
            hotelId: {
                type: STRING,
                allowNull: false,
                references: { model: 'hotels', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            roomNumber: {
                type: STRING,
                allowNull: false
            },
            roomType: {
                type: STRING,
                allowNull: false,
                comment: 'e.g., Single, Double, Suite, Deluxe'
            },
            capacity: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 2,
                comment: 'Maximum number of guests'
            },
            floor: {
                type: INTEGER,
                allowNull: true
            },
            pricePerNight: {
                type: FLOAT,
                allowNull: false
            },
            description: {
                type: TEXT,
                allowNull: true
            },
            amenities: {
                type: TEXT,
                allowNull: true,
                comment: 'JSON array of amenities'
            },
            images: {
                type: TEXT,
                allowNull: true,
                comment: 'JSON array of image URLs'
            },
            isAvailable: {
                type: BOOLEAN,
                defaultValue: true
            },
            createdAt: {
                type: DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add roomId column to bookings table
        await queryInterface.addColumn('bookings', 'roomId', {
            type: STRING,
            allowNull: true,
            references: { model: 'rooms', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    async down(queryInterface) {
        // Remove roomId from bookings
        await queryInterface.removeColumn('bookings', 'roomId');

        // Drop rooms table
        await queryInterface.dropTable('rooms');
    }
};
