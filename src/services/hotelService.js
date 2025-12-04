const { Hotel } = require('../models');
const { v4: uuid } = require('uuid');

function listHotels() {
  return Hotel.findAll();
}

function getHotel(id) {
  return Hotel.findByPk(id);
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
  createHotel,
  updateHotel,
  deleteHotel
};
