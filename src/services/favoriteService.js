const { Favorite } = require('../models');
const { v4: uuid } = require('uuid');
const { listWithPagination } = require('./pagination');

function listFavorites(options = {}) {
  // options can include: page, limit, where (e.g. { userId })
  return listWithPagination(Favorite, options);
}

function getFavorite(id) {
  return Favorite.findByPk(id);
}

function createFavorite(data) {
  return Favorite.create({ id: data.id || uuid(), ...data });
}

async function updateFavorite(id, data) {
  const item = await Favorite.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteFavorite(id) {
  const item = await Favorite.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite
};
