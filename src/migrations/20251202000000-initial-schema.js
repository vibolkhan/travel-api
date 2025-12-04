'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { STRING, TEXT, BOOLEAN, DATE, DATEONLY, INTEGER, FLOAT } = Sequelize;

    await queryInterface.createTable('users', {
      id: { type: STRING, primaryKey: true },
      email: { type: STRING, allowNull: false, unique: true },
      phone: { type: STRING, allowNull: true, unique: true },
      password: { type: STRING, allowNull: false },
      fullName: STRING,
      avatar: STRING,
      role: { type: STRING, allowNull: false, defaultValue: 'user' },
      language: { type: STRING, defaultValue: 'en' },
      verified: { type: BOOLEAN, defaultValue: false },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('hotels', {
      id: { type: STRING, primaryKey: true },
      name: STRING,
      province: STRING,
      address: STRING,
      location: TEXT,      // JSON → TEXT for SQLite
      images: TEXT,
      starRating: INTEGER,
      priceRange: TEXT,
      amenities: TEXT,
      phone: STRING,
      email: STRING,
      website: STRING,
      approved: { type: BOOLEAN, defaultValue: false },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('attractions', {
      id: { type: STRING, primaryKey: true },
      nameEn: STRING,
      nameKh: STRING,
      descriptionEn: TEXT,
      descriptionKh: TEXT,
      province: STRING,
      district: STRING,
      location: TEXT,
      images: TEXT,
      ticketPrice: FLOAT,
      openingHours: STRING,
      category: STRING,
      featured: { type: BOOLEAN, defaultValue: false },
      approved: { type: BOOLEAN, defaultValue: false },
      views: { type: INTEGER, defaultValue: 0 },
      rating: { type: FLOAT, defaultValue: 0 },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('tours', {
      id: { type: STRING, primaryKey: true },
      titleEn: STRING,
      titleKh: STRING,
      descriptionEn: TEXT,
      descriptionKh: TEXT,
      duration: STRING,
      price: FLOAT,
      itinerary: TEXT,
      images: TEXT,
      included: TEXT,
      excluded: TEXT,
      maxPeople: INTEGER,
      province: STRING,
      providerId: {
        type: STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      approved: { type: BOOLEAN, defaultValue: false },
      rating: { type: FLOAT, defaultValue: 0 },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('bookings', {
      id: { type: STRING, primaryKey: true },
      userId: {
        type: STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      tourId: {
        type: STRING,
        allowNull: true,
        references: { model: 'tours', key: 'id' }
      },
      hotelId: {
        type: STRING,
        allowNull: true,
        references: { model: 'hotels', key: 'id' }
      },
      checkIn: DATEONLY,
      checkOut: DATEONLY,
      guests: INTEGER,
      totalPrice: FLOAT,
      status: {
        type: STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      paymentStatus: { type: STRING, defaultValue: 'unpaid' },
      paymentMethod: STRING,
      paymentTranId: STRING,
      bakongTransactionId: STRING,
      refundedAmount: { type: FLOAT, defaultValue: 0 },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('reviews', {
      id: { type: STRING, primaryKey: true },
      userId: {
        type: STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      attractionId: {
        type: STRING,
        allowNull: true,
        references: { model: 'attractions', key: 'id' }
      },
      tourId: {
        type: STRING,
        allowNull: true,
        references: { model: 'tours', key: 'id' }
      },
      rating: INTEGER,
      comment: STRING,
      images: TEXT,
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('favorites', {
      id: { type: STRING, primaryKey: true },
      userId: {
        type: STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      attractionId: {
        type: STRING,
        allowNull: true,
        references: { model: 'attractions', key: 'id' }
      },
      tourId: {
        type: STRING,
        allowNull: true,
        references: { model: 'tours', key: 'id' }
      },
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('favorites');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('tours');
    await queryInterface.dropTable('attractions');
    await queryInterface.dropTable('hotels');
    await queryInterface.dropTable('users');
  }
};
