const { Booking } = require('../models');
const { v4: uuid } = require('uuid');
const { listWithPagination } = require('./pagination');

function listBookings(options = {}) {
  // options can include: page, limit, where (e.g. { userId, status })
  return listWithPagination(Booking, options);
}

function getBooking(id) {
  return Booking.findByPk(id);
}

function createBooking(data) {
  // Convert empty strings to null for optional foreign keys
  const sanitizedData = { ...data };

  // Handle field name variations (e.g., numGuests instead of guests)
  if (data.numGuests && !data.guests) {
    sanitizedData.guests = Number(data.numGuests);
  }

  ['tourId', 'hotelId', 'roomId'].forEach(field => {
    if (sanitizedData[field] === '') {
      sanitizedData[field] = null;
    }
  });

  return Booking.create({ id: sanitizedData.id || uuid(), ...sanitizedData });
}

async function updateBooking(id, data) {
  const item = await Booking.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteBooking(id) {
  const item = await Booking.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
};
