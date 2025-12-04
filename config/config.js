require('dotenv').config();
const path = require('path');

const dbName = process.env.DB_NAME || 'dev';

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', `${dbName}.sqlite`)
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', `${dbName}_test.sqlite`)
  },
  production: {
    dialect: 'sqlite',
    // you can use a different name in production via env
    storage: path.join(__dirname, '..', `${process.env.DB_NAME || 'prod'}.sqlite`)
  }
};
