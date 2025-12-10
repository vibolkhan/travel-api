const { sequelize, User, Destination, Tour, Hotel, Booking, Favorite, Review } = require('./src/models');
const { v4: uuid } = require('uuid');

async function testAllModels() {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true }); // WARNING: This would wipe DB. Better to assume partial sync or use test DB. 
        // For this test script, we assume tables exist.

        console.log('--- STARTING COMPREHENSIVE MODEL TESTS ---');

        const uniqueSuffix = Date.now();
        const userId = uuid();
        const providerId = uuid();
        const destId = uuid();
        const tourId = uuid();
        const hotelId = uuid();

        // --- USER TEST ---
        console.log('\n[USER] Testing...');
        const user = await User.create({
            id: userId,
            email: `testuser_${uniqueSuffix}@example.com`,
            password: 'securepassword',
            fullName: 'Test User',
            role: 'user'
        });
        if (user.email === `testuser_${uniqueSuffix}@example.com`) console.log('  -> Create User: SUCCESS');
        else console.error('  -> Create User: FAILED');

        // Test User Unique Email (Expect Failure)
        try {
            await User.create({
                id: uuid(),
                email: `testuser_${uniqueSuffix}@example.com`,
                password: 'p'
            });
            console.error('  -> Unique Email Constraint: FAILED (Should have thrown error)');
        } catch (e) {
            console.log('  -> Unique Email Constraint: SUCCESS (Caught expected error)');
        }


        // --- DESTINATION TEST ---
        console.log('\n[DESTINATION] Testing...');
        const dest = await Destination.create({
            id: destId,
            nameEn: `Test Dest ${uniqueSuffix}`,
            ticketPrice: 10.5,
            rating: 4.5
        });
        if (dest.id === destId) console.log('  -> Create Destination: SUCCESS');
        else console.error('  -> Create Destination: FAILED');


        // --- TOUR TEST ---
        console.log('\n[TOUR] Testing...');

        // Create a Provider User first
        const providerUser = await User.create({
            id: providerId,
            email: `provider_${uniqueSuffix}@example.com`,
            password: 'providerpass',
            fullName: 'Provider User',
            role: 'provider'
        });
        console.log('  -> Create Provider User: SUCCESS');

        const tour = await Tour.create({
            id: tourId,
            titleEn: `Test Tour ${uniqueSuffix}`,
            providerId: providerId,
            price: 50.0
        });
        if (tour.id === tourId) console.log('  -> Create Tour: SUCCESS');
        else console.error('  -> Create Tour: FAILED');

        // --- HOTEL TEST ---
        console.log('\n[HOTEL] Testing...');
        const hotel = await Hotel.create({
            id: hotelId,
            name: `Test Hotel ${uniqueSuffix}`,
            starRating: 4
        });
        if (hotel.id === hotelId) console.log('  -> Create Hotel: SUCCESS');
        else console.error('  -> Create Hotel: FAILED');


        // --- REVIEW TEST (The one we fixed) ---
        console.log('\n[REVIEW] Testing...');
        // 1. Valid Review
        try {
            await Review.create({
                id: uuid(),
                userId: userId,
                destinationId: destId,
                rating: 5,
                comment: 'Perfect'
            });
            console.log('  -> Valid Review: SUCCESS');
        } catch (e) {
            console.error('  -> Valid Review: FAILED', e.message);
        }

        // 2. Invalid Rating (> 5)
        try {
            await Review.create({
                id: uuid(),
                userId: userId,
                destinationId: destId,
                rating: 6,
                comment: 'High'
            });
            console.error('  -> Invalid Rating Check: FAILED (Should have thrown)');
        } catch (e) {
            console.log('  -> Invalid Rating Check: SUCCESS (Caught expected error)');
        }

        // 3. Missing Target (No dest, no tour)
        try {
            await Review.create({
                id: uuid(),
                userId: userId,
                rating: 4,
                comment: 'Ghost'
            });
            console.error('  -> Missing Target Check: FAILED (Should have thrown)');
        } catch (e) {
            console.log('  -> Missing Target Check: SUCCESS (Caught expected error)');
        }


        // --- FAVORITE TEST ---
        console.log('\n[FAVORITE] Testing...');
        try {
            await Favorite.create({
                id: uuid(),
                userId: userId,
                destinationId: destId
            });
            console.log('  -> Create Favorite: SUCCESS');
        } catch (e) {
            console.error('  -> Create Favorite: FAILED', e.message);
        }


        // --- BOOKING TEST ---
        console.log('\n[BOOKING] Testing...');
        try {
            await Booking.create({
                id: uuid(),
                userId: userId,
                hotelId: hotelId,
                status: 'confirmed',
                totalPrice: 100.0,
                checkIn: new Date(),
                checkOut: new Date()
            });
            console.log('  -> Create Booking: SUCCESS');
        } catch (e) {
            console.error('  -> Create Booking: FAILED', e.message);
        }

        console.log('\n--- TESTS COMPLETED ---');

    } catch (error) {
        console.error('GLOBAL TEST FAILED:', error);
    }
}

testAllModels();
