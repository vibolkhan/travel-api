'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const { STRING } = Sequelize;

        // Add destinationId to hotels table
        await queryInterface.addColumn('hotels', 'destinationId', {
            type: STRING,
            allowNull: true,
            references: {
                model: 'destinations',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add destinationId to tours table
        await queryInterface.addColumn('tours', 'destinationId', {
            type: STRING,
            allowNull: true,
            references: {
                model: 'destinations',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('hotels', 'destinationId');
        await queryInterface.removeColumn('tours', 'destinationId');
    }
};
