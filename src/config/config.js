const dotenv = require("dotenv");
dotenv.config();

const config = {
   
    APP_PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT:  process.env.DB_PORT,
    DB_USER:  process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME

}

module.exports = config;