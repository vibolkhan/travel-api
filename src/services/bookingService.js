const { Booking } = require('../models');
const { v4: uuid } = require('uuid');

function listBookings() {
  return Booking.findAll();
}

function getBooking(id) {
  return Booking.findByPk(id);
}

function createBooking(data) {
  return Booking.create({ id: data.id || uuid(), ...data });
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
