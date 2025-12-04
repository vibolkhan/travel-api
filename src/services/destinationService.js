const { Destination } = require('../models');
const { v4: uuid } = require('uuid');

function listDestinations() {
  return Destination.findAll();
}

function getDestination(id) {
  return Destination.findByPk(id);
}

function createDestination(data) {
  return Destination.create({ id: data.id || uuid(), ...data });
}

async function updateDestination(id, data) {
  const item = await Destination.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteDestination(id) {
  const item = await Destination.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
};
