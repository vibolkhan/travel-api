const { Tour } = require('../models');
const { v4: uuid } = require('uuid');
const { listWithPagination } = require('./pagination');

function listTours(options = {}) {
  // options can include: page, limit, where (e.g. { province, providerId })
  return listWithPagination(Tour, options);
}

function getTour(id) {
  return Tour.findByPk(id);
}

function getToursByDestination(destinationId, options = {}) {
  const where = { ...options.where, destinationId };
  return listWithPagination(Tour, { ...options, where });
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
  getToursByDestination,
  createTour,
  updateTour,
  deleteTour
};
