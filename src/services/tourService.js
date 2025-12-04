const { Tour } = require('../models');
const { v4: uuid } = require('uuid');

function listTours() {
  return Tour.findAll();
}

function getTour(id) {
  return Tour.findByPk(id);
}

function createTour(data) {
  return Tour.create({ id: data.id || uuid(), ...data });
}

async function updateTour(id, data) {
  const item = await Tour.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteTour(id) {
  const item = await Tour.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
};
