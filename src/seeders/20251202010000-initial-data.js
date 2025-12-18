'use strict';

const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('123', 10);

    // 1) USERS
    const users = [
      { id: randomUUID(), email: 'admin@example.com', password: passwordHash, fullName: 'System Admin', role: 'admin', verified: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), email: 'provider@example.com', password: passwordHash, fullName: 'Tour Provider', role: 'provider', verified: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), email: 'user@example.com', password: passwordHash, fullName: 'Demo User', role: 'user', verified: true, createdAt: now, updatedAt: now }
    ];
    await queryInterface.bulkInsert('users', users);

    const providerId = users[1].id;
    const userId = users[2].id;

    // 2) DATA GENERATION
    const destinationData = [
      { nameEn: 'Angkor Wat', nameKh: 'អង្គរវត្ត', province: 'Siem Reap', category: 'Historical' },
      { nameEn: 'Koh Rong', nameKh: 'កោះរ៉ុង', province: 'Sihanoukville', category: 'Nature' },
      { nameEn: 'Royal Palace', nameKh: 'ព្រះបរមរាជវាំង', province: 'Phnom Penh', category: 'Culture' },
      { nameEn: 'Bokor Mountain', nameKh: 'ភ្នំបូកគោ', province: 'Kampot', category: 'Nature' },
      { nameEn: 'Bousra Waterfall', nameKh: 'ទឹកជ្រោះប៊ូស្រា', province: 'Mondulkiri', category: 'Nature' },
      { nameEn: 'Bamboo Train', nameKh: 'ឡូរី', province: 'Battambang', category: 'Activity' },
      { nameEn: 'Crab Market', nameKh: 'ផ្សារក្តាម', province: 'Kep', category: 'Food' },
      { nameEn: 'Preah Vihear Temple', nameKh: 'ប្រាសាទព្រះវិហារ', province: 'Preah Vihear', category: 'Historical' }
    ];

    const destinations = [];
    const hotels = [];
    const rooms = [];
    const tours = [];

    for (const data of destinationData) {
      const destId = randomUUID();
      destinations.push({
        id: destId,
        ...data,
        ticketPrice: Math.floor(Math.random() * 40),
        rating: (4 + Math.random()).toFixed(1),
        approved: true,
        createdAt: now,
        updatedAt: now
      });

      // Random Hotels (1 to 5)
      const numHotels = Math.floor(Math.random() * 5) + 1;
      for (let h = 1; h <= numHotels; h++) {
        const hotelId = randomUUID();
        hotels.push({
          id: hotelId,
          name: `${data.nameEn} ${['Resort', 'Hotel', 'Inn', 'Villas', 'Lodge'][h % 5]}`,
          province: data.province,
          starRating: Math.floor(Math.random() * 3) + 3,
          destinationId: destId,
          approved: true,
          createdAt: now,
          updatedAt: now
        });

        // Random Rooms (1 to 10)
        const numRooms = Math.floor(Math.random() * 10) + 1;
        for (let r = 1; r <= numRooms; r++) {
          rooms.push({
            id: randomUUID(),
            hotelId: hotelId,
            roomNumber: `${h}0${r}`,
            roomType: ['Standard', 'Deluxe', 'Suite', 'King'][r % 4],
            capacity: Math.floor(Math.random() * 2) + 2,
            pricePerNight: Math.floor(Math.random() * 200) + 50,
            isAvailable: true,
            createdAt: now,
            updatedAt: now
          });
        }
      }

      // Random Tours (1 to 5)
      const numTours = Math.floor(Math.random() * 5) + 1;
      for (let t = 1; t <= numTours; t++) {
        tours.push({
          id: randomUUID(),
          titleEn: `${data.nameEn} ${['Discovery', 'Full Day', 'Adventure', 'Private', 'Sunset'][t % 5]} Tour`,
          price: Math.floor(Math.random() * 100) + 10,
          province: data.province,
          providerId: providerId,
          destinationId: destId,
          approved: true,
          createdAt: now,
          updatedAt: now
        });
      }
    }

    await queryInterface.bulkInsert('destinations', destinations);
    await queryInterface.bulkInsert('hotels', hotels);
    await queryInterface.bulkInsert('rooms', rooms);
    await queryInterface.bulkInsert('tours', tours);

    // 3) BOOKINGS (Sample set)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    const bookings = [
      {
        id: randomUUID(),
        userId: userId,
        tourId: tours[0].id,
        checkIn: pastDate,
        checkOut: pastDate,
        status: 'pending', // Will show as completed via model
        totalPrice: tours[0].price,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        userId: userId,
        hotelId: hotels[0].id,
        roomId: rooms[0].id,
        checkIn: now,
        checkOut: new Date(now.getTime() + 86400000),
        status: 'pending',
        totalPrice: rooms[0].pricePerNight,
        createdAt: now,
        updatedAt: now
      }
    ];
    await queryInterface.bulkInsert('bookings', bookings);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('rooms', null, {});
    await queryInterface.bulkDelete('tours', null, {});
    await queryInterface.bulkDelete('hotels', null, {});
    await queryInterface.bulkDelete('destinations', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
