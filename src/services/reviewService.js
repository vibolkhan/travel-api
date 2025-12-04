const { Review } = require('../models');
const { v4: uuid } = require('uuid');

function listReviews() {
  return Review.findAll();
}

function getReview(id) {
  return Review.findByPk(id);
}

function createReview(data) {
  return Review.create({ id: data.id || uuid(), ...data });
}

async function updateReview(id, data) {
  const item = await Review.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function deleteReview(id) {
  const item = await Review.findByPk(id);
  if (!item) return 0;
  await item.destroy();
  return 1;
}

module.exports = {
  listReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
};
