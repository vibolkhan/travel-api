module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attractionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tourId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    images: DataTypes.JSON
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  return Review;
};
