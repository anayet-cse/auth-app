const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YourSecurePassword',
  database: 'authApp'
});

module.exports = db;