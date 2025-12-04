const { Attraction } = require('../models');
const { v4: uuid } = require('uuid');

function listAttractions() {
  return Attraction.findAll();
}

function getAttraction(id) {
  return Attraction.findByPk(id);
}

function createAttraction(data) {
  return Attraction.create({ id: data.id || uuid(), ...data });
}

async function updateAttraction(id, data) {
  const item = await Attraction.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteAttraction(id) {
  const item = await Attraction.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listAttractions,
  getAttraction,
  createAttraction,
  updateAttraction,
  deleteAttraction
};
