const Sequelize = require('sequelize');
const db = new Sequelize('authApp', 'root', 'YourSecurePassword', {
  host: 'localhost',
  dialect: 'mysql' 
});

module.exports = db;