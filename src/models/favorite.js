module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
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
    }
  }, {
    tableName: 'favorites',
    timestamps: true
  });

  return Favorite;
};
