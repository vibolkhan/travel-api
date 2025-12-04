const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, DataTypes);
const Hotel = require('./hotel')(sequelize, DataTypes);
const Attraction = require('./attraction')(sequelize, DataTypes);
const Tour = require('./tour')(sequelize, DataTypes);
const Booking = require('./booking')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const Favorite = require('./favorite')(sequelize, DataTypes);

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId' });

Attraction.hasMany(Review, { foreignKey: 'attractionId' });
Review.belongsTo(Attraction, { foreignKey: 'attractionId' });

Attraction.hasMany(Favorite, { foreignKey: 'attractionId' });
Favorite.belongsTo(Attraction, { foreignKey: 'attractionId' });

Tour.hasMany(Booking, { foreignKey: 'tourId' });
Booking.belongsTo(Tour, { foreignKey: 'tourId' });

Tour.hasMany(Review, { foreignKey: 'tourId' });
Review.belongsTo(Tour, { foreignKey: 'tourId' });

Tour.hasMany(Favorite, { foreignKey: 'tourId' });
Favorite.belongsTo(Tour, { foreignKey: 'tourId' });

User.hasMany(Tour, { foreignKey: 'providerId', as: 'tours' });
Tour.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

module.exports = {
  sequelize,
  User,
  Hotel,
  Attraction,
  Tour,
  Booking,
  Review,
  Favorite
};
