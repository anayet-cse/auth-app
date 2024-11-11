const dataTypes = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'users',
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
    auth_id: {
      type: dataTypes.INTEGER,
      allowNull: false,
      foreignKey: true
    },
    firstName: {
      type: dataTypes. STRING,
        allowNull: false,
    },
    lastName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    nid: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    profilePhoto: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    age: {
        type: dataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    maritalStatus: {
      type: dataTypes.STRING,
      allowNull: false,
    }
  }
);

module.exports = User


