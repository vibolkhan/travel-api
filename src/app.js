const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/hotels', require('./routes/hotelRoutes'));
app.use('/attractions', require('./routes/attractionRoutes'));
app.use('/tours', require('./routes/tourRoutes'));
app.use('/bookings', require('./routes/bookingRoutes'));
app.use('/reviews', require('./routes/reviewRoutes'));
app.use('/favorites', require('./routes/favoriteRoutes'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Travel API' });
});

module.exports = app;
