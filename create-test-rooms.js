const db = require('./src/models');
const { v4: uuid } = require('uuid');

(async () => {
    try {
        console.log('Creating test rooms...\n');

        // Get first hotel
        const hotel = await db.Hotel.findOne();
        if (!hotel) {
            console.error('No hotels found. Please create a hotel first.');
            process.exit(1);
        }

        console.log(`Using hotel: ${hotel.name} (${hotel.id})\n`);

        // Create sample rooms
        const rooms = [
            {
                id: uuid(),
                hotelId: hotel.id,
                roomNumber: '101',
                roomType: 'Standard',
                capacity: 2,
                floor: 1,
                pricePerNight: 50,
                description: 'Comfortable standard room with queen bed',
                amenities: ['WiFi', 'TV', 'AC'],
                images: ['https://example.com/room101.jpg'],
                isAvailable: true
            },
            {
                id: uuid(),
                hotelId: hotel.id,
                roomNumber: '201',
                roomType: 'Deluxe',
                capacity: 2,
                floor: 2,
                pricePerNight: 75,
                description: 'Spacious deluxe room with city view',
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
                images: ['https://example.com/room201.jpg'],
                isAvailable: true
            },
            {
                id: uuid(),
                hotelId: hotel.id,
                roomNumber: '301',
                roomType: 'Suite',
                capacity: 4,
                floor: 3,
                pricePerNight: 120,
                description: 'Luxury suite with separate living area',
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi'],
                images: ['https://example.com/room301.jpg'],
                isAvailable: true
            }
        ];

        for (const roomData of rooms) {
            const room = await db.Room.create(roomData);
            console.log(`✓ Created room ${room.roomNumber} (${room.roomType}) - $${room.pricePerNight}/night`);
        }

        // Query and display rooms
        console.log('\n--- All Rooms ---');
        const allRooms = await db.Room.findAll({
            include: [{ model: db.Hotel, attributes: ['name'] }]
        });

        allRooms.forEach(room => {
            console.log(`Room ${room.roomNumber}: ${room.roomType} - $${room.pricePerNight}/night at ${room.Hotel.name}`);
        });

        console.log(`\n✓ Successfully created ${rooms.length} test rooms!`);
        console.log(`\nRoom IDs for testing:`);
        rooms.forEach(r => console.log(`  - ${r.id} (${r.roomType})`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error);
        process.exit(1);
    }
})();
