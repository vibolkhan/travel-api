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
    roomId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    guests: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('pending', 'cancelled', 'completed'),
      defaultValue: 'pending',
      get() {
        const rawValue = this.getDataValue('status');
        const checkOut = this.getDataValue('checkOut');
        if (rawValue !== 'cancelled' && checkOut && new Date(checkOut) < new Date()) {
          return 'completed';
        }
        return rawValue;
      }
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
