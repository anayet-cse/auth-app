const express = require('express');
const bodyParse = require('body-parser');
const db = require('./src/config/db');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParse.json());

db.connect((err) => {
  if (err) {
    console.error('Error connecting mysql');
    return;
  }
  console.log(`connected to mysql db ${port}`);
});
