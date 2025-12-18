module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define('Tour', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    titleEn: DataTypes.STRING,
    titleKh: DataTypes.STRING,
    descriptionEn: DataTypes.TEXT,
    descriptionKh: DataTypes.TEXT,
    duration: DataTypes.STRING,
    price: DataTypes.FLOAT,
    itinerary: DataTypes.JSON,
    images: DataTypes.JSON,
    included: DataTypes.JSON,
    excluded: DataTypes.JSON,
    maxPeople: DataTypes.INTEGER,
    province: DataTypes.STRING,
    providerId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    destinationId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'tours',
    timestamps: true
  });

  return Tour;
};
