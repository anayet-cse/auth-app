const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/config/db');
const ApiResponseMessage = require('./utils/utils')

const port = process.env.PORT || 3000;

const query = util.promisify(db.query).bind(db);
const beginTransaction = util.promisify(db.beginTransaction).bind(db);
const commit = util.promisify(db.commit).bind(db);
const rollback = util.promisify(db.rollback).bind(db);

const app = express();
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.error('Error connecting mysql');
    return;
  }
  console.log(`connected to mysql db ${port}`);
});

app.listen(port, ()=> {
  console.log(`app is running at ${port}`);
});

app.post('/users', async function(req, res) {
  try {
    await beginTransaction();
    const {firstName, lastName, nid,
        profilePhoto, age, maritalStatus, email, password
    } = req.body;
    
    const user_email = await query('SELECT email FROM auth WHERE email = ?', [email]);
    if (user_email.length > 0) {
      await rollback();
      return res.status(400).send({
        "message": "Already registered with this email account."
      });
    }

    await query(
        'INSERT INTO users (firstName, lastName, nid, profilePhoto, age, maritalStatus) VALUES (?, ?, ?, ?, ?, ?)', 
        [firstName, lastName, nid, profilePhoto, age, maritalStatus]
    );
    await query(
        'INSERT INTO auth (email, password) VALUES (?, ?)', 
        [email, password]
    );
    await commit();

    res.status(201).send({
        "message": ApiResponseMessage.USER_CREATE
    });
  } catch (error) {
    await rollback();
    res.status(400).send({
        "message": ApiResponseMessage.SYSTEM_ERROR
    });
  }
});