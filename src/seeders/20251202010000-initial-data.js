'use strict';

const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Generate UUIDs once and reuse them for relationships
    const adminId = randomUUID();
    const userId = randomUUID();
    const providerId = randomUUID();

    const hotelId = randomUUID();
    const destinationId = randomUUID();
    const tourId = randomUUID();

    const bookingId = randomUUID();
    const reviewId = randomUUID();
    const favorite1Id = randomUUID();
    const favorite2Id = randomUUID();

    const adminPasswordHash = await bcrypt.hash('123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);
    const providerPasswordHash = await bcrypt.hash('provider123', 10);

    // 1) USERS
    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        email: 'admin@example.com',
        phone: null,
        password: adminPasswordHash,
        fullName: 'System Administrator',
        avatar: null,
        role: 'admin',
        language: 'en',
        verified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: userId,
        email: 'user@example.com',
        phone: '+85512345678',
        password: userPasswordHash,
        fullName: 'Demo User',
        avatar: null,
        role: 'user',
        language: 'en',
        verified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: providerId,
        email: 'provider@example.com',
        phone: '+85587654321',
        password: providerPasswordHash,
        fullName: 'Demo Provider',
        avatar: null,
        role: 'provider',
        language: 'en',
        verified: true,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // 2) HOTELS
    await queryInterface.bulkInsert(
      'hotels',
      [
        {
          id: hotelId,
          name: 'Memot Riverside Hotel',
          province: 'Tbong Khmum',
          address: 'Memot Town, Tbong Khmum',
          location: JSON.stringify({ lat: 11.8605, lng: 105.8483 }),
          images: JSON.stringify(['https://example.com/hotels/hotel-1-1.jpg']),
          starRating: 4,
          priceRange: JSON.stringify({ min: 25, max: 80, currency: 'USD' }),
          amenities: JSON.stringify(['Free WiFi', 'Parking']),
          phone: '+85512340001',
          email: 'info@memotriverside.com',
          website: null,
          approved: true,
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );

    // 3) DESTINATIONS
    await queryInterface.bulkInsert(
      'destinations',
      [
        {
          id: destinationId,
          nameEn: 'Rubber Plantation Viewpoint',
          nameKh: 'ចំណុចមើលទេសភាពចំការកៅស៊ូ',
          descriptionEn: 'Beautiful scenery.',
          descriptionKh: 'ទេសភាពល្អបំផុត។',
          province: 'Tbong Khmum',
          district: 'Memot',
          location: JSON.stringify({ lat: 11.8623, lng: 105.8512 }),
          images: JSON.stringify(['https://example.com/destinations/1.jpg']),
          ticketPrice: 2.5,
          openingHours: '08:00-17:00',
          category: 'Nature',
          featured: true,
          approved: true,
          views: 30,
          rating: 4.5,
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );

    // 4) TOURS
    await queryInterface.bulkInsert(
      'tours',
      [
        {
          id: tourId,
          titleEn: 'Rubber Plantation Day Tour',
          titleKh: 'ការធ្វើដំណើរថ្ងៃតែមើលចំការកៅស៊ូ',
          descriptionEn: 'Explore Memot rubber plantations.',
          descriptionKh: 'ស្វែងយល់ពីចំការកៅស៊ូ។',
          duration: '1 day',
          price: 45,
          itinerary: JSON.stringify([
            { time: '08:00', activity: 'Pick-up' },
            { time: '10:00', activity: 'Visit rubber farm' }
          ]),
          images: JSON.stringify(['https://example.com/tours/1.jpg']),
          included: JSON.stringify(['Transport', 'Guide']),
          excluded: JSON.stringify(['Personal expenses']),
          maxPeople: 10,
          province: 'Tbong Khmum',
          providerId: providerId, // FK to provider user
          approved: true,
          rating: 4.7,
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );

    // 5) BOOKINGS
    await queryInterface.bulkInsert(
      'bookings',
      [
        {
          id: bookingId,
          userId: userId,
          tourId: tourId,
          hotelId: hotelId,
          checkIn: '2025-12-10',
          checkOut: '2025-12-11',
          guests: 2,
          totalPrice: 90,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          paymentTranId: 'TXN001',
          bakongTransactionId: null,
          refundedAmount: 0,
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );

    // 6) REVIEWS
    await queryInterface.bulkInsert(
      'reviews',
      [
        {
          id: reviewId,
          userId: userId,
          destinationId: destinationId,
          tourId: tourId,
          rating: 5,
          comment: 'Very good!',
          images: JSON.stringify(['https://example.com/reviews/1.jpg']),
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );

    // 7) FAVORITES
    await queryInterface.bulkInsert(
      'favorites',
      [
        {
          id: favorite1Id,
          userId: userId,
          destinationId: destinationId,
          tourId: null,
          createdAt: now,
          updatedAt: now
        },
        {
          id: favorite2Id,
          userId: userId,
          destinationId: null,
          tourId: tourId,
          createdAt: now,
          updatedAt: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    // simplest: wipe all rows from these tables
    await queryInterface.bulkDelete('favorites', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('tours', null, {});
    await queryInterface.bulkDelete('destinations', null, {});
    await queryInterface.bulkDelete('hotels', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
