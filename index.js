const util = require('util');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const express = require('express');
const crypto = require('crypto-js');

const bodyParser = require('body-parser');
const db = require('./src/config/db');
const ApiResponseMessage = require('./utils/utils')

const port = process.env.PORT || 3001;

const query = util.promisify(db.query).bind(db);
const beginTransaction = util.promisify(db.beginTransaction).bind(db);
const commit = util.promisify(db.commit).bind(db);
const rollback = util.promisify(db.rollback).bind(db);

const SALT = 2;

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { filename } = req.file;

  res.status(200).send(`File uploaded successfully: ${filename}`);
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
    const hashPassword = await bcrypt.hashSync(password, SALT);

    const temp = await query(
      'INSERT INTO auth (email, password) VALUES (?, ?)', 
      [email, hashPassword]
    );
    console.log(temp);

    await query(
        'INSERT INTO users (auth_id, firstName, lastName, nid, profilePhoto, age, maritalStatus) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [temp.insertId, firstName, lastName, nid, profilePhoto, age, maritalStatus]
    );
    
    

    await commit();

    res.status(201).send({
        "message": ApiResponseMessage.USER_CREATE
    });
  } catch (error) {
    console.log(error)
    await rollback();
    res.status(400).send({
      "message": ApiResponseMessage.SYSTEM_ERROR
    });
  }
});


app.put('/users/:users_email', async function(req, res) {
  try {
    await beginTransaction();
    const email = req.params.users_email; 

    user_email = await query('SELECT email FROM auth WHERE email = ?', [email]);

    if(user_email.length == 0) {
      await rollback();
      res.status(400).send({
        "message": "There is no account with this email."
      })
    }

    const auth_id = await query('SELECT id FROM auth WHERE email = ?', [email]);
  
    const {firstName, lastName} = req.body;

    await query('UPDATE users SET firstName = ?, lastName = ? WHERE auth_id = ?', 
      [firstName, lastName, auth_id[0].id]);
    
    await commit();

    res.status(200).send({
      message: ApiResponseMessage.USER_UPDATE
    });
  } catch(error) {
    console.log(error)
    await rollback();
    res.status(400).ApiResponseMessage.BAD_REQUEST
  }
});


app.delete('/users/:email', async function(req, res) {
 
  try {
    await beginTransaction();
    const email = req.params.email;
    const user_email = await query('SELECT email FROM auth WHERE email = ?', [email]);
    if(user_email.length == 0) {
      await rollback();
      res.status(400).send({
        "message": "There is no account with this email."
      })
    } 
    
    const id = await query('SELECT id FROM auth WHERE email = ?', [email]);
    console.log(id);
    await query('DELETE FROM auth WHERE email = ?', 
      [email]);
    await query('DELETE FROM users WHERE auth_id = ?', [id]);
    await commit();
  } catch (error) {
    console.log(error);
    await rollback();
    res.status(404).send({
      message: "Successfully delete your account"
    })
  }
});

app.get('/users/:users_email', async function(req, res) {
  try {
    await beginTransaction();
    const email = req.params.users_email;
    const users_email = await query('SELECT email FROM auth WHERE email = ?', [email]);
    if(users_email.length == 0) {
      await rollback();
      res.status(404).send({
        message: "There is no account with this email acoount"
      })
    }
  
    const userId = await query('SELECT id FROM auth WHERE email = ?', [email]);
    console.log(userId)
    const user = await query('SELECT firstName, lastName, nid, profilePhoto, age, maritalStatus FROM users WHERE auth_id = ?', [userId[0].id]);
    console.log(user);
    res.json(user);
    res.status(200);
    await commit();
  } catch (error) {
    console.log(error);
    await rollback();
  }
});