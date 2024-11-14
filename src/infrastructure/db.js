const Sequelize = require('sequelize');
const config = require('../config/config');
const db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql' 
});

module.exports = db;