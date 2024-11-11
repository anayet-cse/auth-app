const dataTypes = require('sequelize');
const sequelize = require('../config/db');

const Auth = sequelize.define(
  'auths',
  {
    createdAt: {
      type: dataTypes.DATE,
    },
    updatedAt: {
      type: dataTypes.DATE,
    },
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    auth_token: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  }
);

module.exports = Auth;





