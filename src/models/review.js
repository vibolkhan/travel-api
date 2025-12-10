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
    destinationId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tourId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: DataTypes.STRING,
    images: DataTypes.JSON
  }, {
    tableName: 'reviews',
    timestamps: true,
    validate: {
      eitherDestinationOrTour() {
        if (!this.destinationId && !this.tourId) {
          throw new Error('Review must belong to a destination or tour.');
        }
      }
    }
  });

  return Review;
};
