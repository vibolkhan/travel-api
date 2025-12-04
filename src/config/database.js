require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const dbName = process.env.DB_NAME || 'dev';
const storage = path.join(__dirname, '..', '..', `${dbName}.sqlite`);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = sequelize;
