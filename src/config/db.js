const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YourSecurePassword',
  database: 'authApp'
});

module.exports = db;


// const Sequelize = require('sequelize');

// const db = new Sequelize(
//   process.env.DB_NANE,
//   process.env.DB_USER,
//   process.DB_PASSWORD, 
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
//   }
// );

// module.exports = db;