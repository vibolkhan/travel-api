module.exports = (sequelize, DataTypes) => {
  const Attraction = sequelize.define('Attraction', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nameEn: DataTypes.STRING,
    nameKh: DataTypes.STRING,
    descriptionEn: DataTypes.TEXT,
    descriptionKh: DataTypes.TEXT,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    location: DataTypes.JSON,
    images: DataTypes.JSON,
    ticketPrice: DataTypes.FLOAT,
    openingHours: DataTypes.STRING,
    category: DataTypes.STRING,
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'attractions',
    timestamps: true
  });

  return Attraction;
};
