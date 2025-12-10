const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const API_PREFIX = '/api/v1';


// Routes
app.use(`${API_PREFIX}/auth`, require('./routes/authRoutes'));
app.use(`${API_PREFIX}/users`, require('./routes/userRoutes'));
app.use(`${API_PREFIX}/hotels`, require('./routes/hotelRoutes'));
app.use(`${API_PREFIX}/destinations`, require('./routes/destinationRoutes'));
app.use(`${API_PREFIX}/tours`, require('./routes/tourRoutes'));
app.use(`${API_PREFIX}/bookings`, require('./routes/bookingRoutes'));
app.use(`${API_PREFIX}/reviews`, require('./routes/reviewRoutes'));
app.use(`${API_PREFIX}/favorites`, require('./routes/favoriteRoutes'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Travel API' });
});

module.exports = app;
