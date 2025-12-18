const { Hotel } = require('../models');
const { v4: uuid } = require('uuid');
const { listWithPagination } = require('./pagination');

function listHotels(options = {}) {
  // options can include: page, limit, where (e.g. { province })
  return listWithPagination(Hotel, options);
}

function getHotel(id) {
  return Hotel.findByPk(id);
}

function getHotelsByDestination(destinationId, options = {}) {
  const where = { ...options.where, destinationId };
  return listWithPagination(Hotel, { ...options, where });
}

function createHotel(data) {
  return Hotel.create({ id: data.id || uuid(), ...data });
}

async function updateHotel(id, data) {
  const item = await Hotel.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteHotel(id) {
  const item = await Hotel.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listHotels,
  getHotel,
  getHotelsByDestination,
  createHotel,
  updateHotel,
  deleteHotel
};
