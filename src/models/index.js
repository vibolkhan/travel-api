const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, DataTypes);
const Hotel = require('./hotel')(sequelize, DataTypes);
const Destination = require('./destinations')(sequelize, DataTypes);
const Tour = require('./tour')(sequelize, DataTypes);
const Booking = require('./booking')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const Favorite = require('./favorite')(sequelize, DataTypes);
const Room = require('./room')(sequelize, DataTypes);

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId' });

Hotel.hasMany(Room, { foreignKey: 'hotelId' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

Destination.hasMany(Review, { foreignKey: 'destinationId' });
Review.belongsTo(Destination, { foreignKey: 'destinationId' });

Destination.hasMany(Favorite, { foreignKey: 'destinationId' });
Favorite.belongsTo(Destination, { foreignKey: 'destinationId' });

Tour.hasMany(Booking, { foreignKey: 'tourId' });
Booking.belongsTo(Tour, { foreignKey: 'tourId' });

Tour.hasMany(Review, { foreignKey: 'tourId' });
Review.belongsTo(Tour, { foreignKey: 'tourId' });

Tour.hasMany(Favorite, { foreignKey: 'tourId' });
Favorite.belongsTo(Tour, { foreignKey: 'tourId' });

User.hasMany(Tour, { foreignKey: 'providerId', as: 'tours' });
Tour.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

Destination.hasMany(Hotel, { foreignKey: 'destinationId' });
Hotel.belongsTo(Destination, { foreignKey: 'destinationId' });

Destination.hasMany(Tour, { foreignKey: 'destinationId' });
Tour.belongsTo(Destination, { foreignKey: 'destinationId' });

module.exports = {
  sequelize,
  User,
  Hotel,
  Destination,
  Tour,
  Booking,
  Review,
  Favorite,
  Room
};
