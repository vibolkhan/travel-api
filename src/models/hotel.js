module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    province: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.JSON,
    images: DataTypes.JSON,
    starRating: DataTypes.INTEGER,
    priceRange: DataTypes.JSON,
    amenities: DataTypes.JSON,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'hotels',
    timestamps: true
  });

  return Hotel;
};
