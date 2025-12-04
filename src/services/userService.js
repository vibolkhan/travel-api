const { User } = require('../models');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');
const { listWithPagination } = require('./pagination');

async function createUser(payload) {
  const id = payload.id || uuid();
  const hashed = await bcrypt.hash(payload.password, 10);

  return User.create({
    id,
    email: payload.email,
    phone: payload.phone,
    password: hashed,
    fullName: payload.fullName,
    avatar: payload.avatar,
    role: payload.role || 'user',
    language: payload.language || 'en'
  });
}

function getUsers(options = {}) {
  // options can include: page, limit, where (e.g. { role })
  return listWithPagination(User, {
    ...options,
    attributes: { exclude: ['password'] }
  });
}

function getUserById(id) {
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
}

async function updateUser(id, payload) {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  await user.update(payload);
  const plain = user.toJSON();
  delete plain.password;
  return plain;
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return 0;
  await user.destroy();
  return 1;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
