module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        hotelId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roomNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roomType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
        },
        floor: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pricePerNight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        amenities: {
            type: DataTypes.JSON,
            allowNull: true
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'rooms',
        timestamps: true
    });

    return Room;
};
