const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/hotels', require('./routes/hotelRoutes'));
app.use('/destinations', require('./routes/destinationRoutes'));
app.use('/tours', require('./routes/tourRoutes'));
app.use('/bookings', require('./routes/bookingRoutes'));
app.use('/reviews', require('./routes/reviewRoutes'));
app.use('/favorites', require('./routes/favoriteRoutes'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Travel API' });
});

module.exports = app;
