module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tourId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hotelId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkIn: DataTypes.DATEONLY,
    checkOut: DataTypes.DATEONLY,
    guests: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'unpaid'
    },
    paymentMethod: DataTypes.STRING,
    paymentTranId: DataTypes.STRING,
    bakongTransactionId: DataTypes.STRING,
    refundedAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'bookings',
    timestamps: true
  });

  return Booking;
};
