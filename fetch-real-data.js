const { sequelize, User, Destination, Tour, Hotel } = require('./src/models');

async function fetchRealData() {
    try {
        await sequelize.authenticate();
        console.log('--- REAL DATA ---');

        const user = await User.findOne({ where: { role: 'user' } });
        const provider = await User.findOne({ where: { role: 'provider' } });
        const destination = await Destination.findOne();
        const tour = await Tour.findOne();
        const hotel = await Hotel.findOne();

        if (user) console.log(`USER_ID: ${user.id}`);
        if (user) console.log(`USER_EMAIL: ${user.email}`);

        if (provider) console.log(`PROVIDER_ID: ${provider.id}`);

        if (destination) console.log(`DESTINATION_ID: ${destination.id}`);

        if (tour) console.log(`TOUR_ID: ${tour.id}`);

        if (hotel) console.log(`HOTEL_ID: ${hotel.id}`);

        console.log('-----------------');
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

fetchRealData();
