module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('user', 'admin', 'provider'),
      defaultValue: 'user'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
