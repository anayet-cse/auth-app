// const util = require('util');
// const path = require('path');
// const multer = require('multer');
// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// const express = require('express');

// const db = require('/home/anayet/Documents/auth-app/src/config/db');
// const bodyParser = require('body-parser');
// const ApiResponseMessage = require('/home/anayet/Documents/auth-app/utils/utils')

// const query = util.promisify(db.query).bind(db);
// const commit = util.promisify(db.commit).bind(db);
// const rollback = util.promisify(db.rollback).bind(db);
// const beginTransaction = util.promisify(db.beginTransaction).bind(db);

// const SALT = 8;

// const router = express.Router();
// router.use(bodyParser.json());

// db.connect((error) => {
//     if (error) {
//       console.error('Error connecting mysql');
//       return;
//     }
//     console.log(`connected to mysql db ${port}`);
//   });

  
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
//   });
  
//   const upload = multer({ storage });
//   router.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  
// router.post('/users', upload.single('profilePhoto'), async (req, res) => {
//     try {
//       await beginTransaction();
//       const { filename } = req.file;
//       const filePath = __dirname + '/'+ filename;
      
//       const {
//         firstName, lastName, nid,
//         age, maritalStatus, email, password
//       } = req.body;
      
//       const userEmail = await query('SELECT email FROM auth WHERE email = ?', [email]);
//       if (userEmail.length > 0) {
//         await rollback();
//         return res.status(400).send({
//           "message": "Already registered with this email account."
//         });
//       }
  
//       const hashPassword = await bcrypt.hashSync(password, SALT);
  
//       const temp = await query(
//         'INSERT INTO auth (email, password) VALUES (?, ?)', 
//         [email, hashPassword]
//       );
  
//       await query(
//           'INSERT INTO users (auth_id, firstName, lastName, nid, profilePhoto, age, maritalStatus) VALUES (?, ?, ?, ?, ?, ?, ?)', 
//           [temp.insertId, firstName, lastName, nid, filePath, age, maritalStatus]
//       );
  
//       await commit();
  
//       return res.status(201).send({
//           "message": ApiResponseMessage.USER_CREATE
//       });
//     } catch (error) {
//       await rollback();
//       return res.status(400).send({
//         "message": ApiResponseMessage.SYSTEM_ERROR
//       });
//     }
//   });
  
  
//   router.post('/users/login', async function(req, res){
//     try {
//       const {email, password} = req.body;
  
//       const user = await query('SELECT email, password FROM auth WHERE email = ?', [email]);
//       console.log(user);
//       if(user.length == 0) {
//         return res.status(400).send({
//           'message': 'There is no account with this email.' 
//         })
//       }
  
//       const passwordIsValid = bcrypt.compareSync(password, user[0].password);
//       if(!passwordIsValid) {
//         return res.status(400).send({
//           'message': 'Invalid email or password.'
//         });
//       }
  
//       const authToken = crypto.randomBytes(16).toString("hex");
//       console.log(authToken);
  
//       const token = await query('UPDATE auth SET auth_token = ? WHERE email = ?', [authToken, email]);
//       res.status(200).json(authToken);
//     } catch(err) {
//       return res.status(500).json({ err: "Internal Server Error." });
//     }
//   })
  
  
//   router.put('/users/:auth_token', async function(req, res) {
//     try {
//       const authToken = req.params.auth_token; 
  
//       const user = await query('SELECT id, email FROM auth WHERE auth_token = ?', [authToken]);
//       if(user.length === 0) {
//         return res.status(400).send({
//           "message": "Login First."
//         })
//       }
    
//       const {firstName, lastName, nid, age, maritalStatus} = req.body;
  
//       await query('UPDATE users SET firstName = ?, lastName = ?, nid = ?, age = ?, maritalStatus = ? WHERE auth_id = ?', 
//         [firstName, lastName, nid, age, maritalStatus, user[0].id]);
  
//       res.status(200).send({
//         message: ApiResponseMessage.USER_UPDATE
//       });
//     } catch(error) {
//       return res.status(500).json({ error: "Internal Server Error." });
//     }
//   });
  
  
//   router.delete('/users/:auth_token', async function(req, res) {
//     try {
//       await beginTransaction();
      
//       const authToken = req.params.auth_token;
//       const user = await query('SELECT id, email FROM auth WHERE auth_token = ?', [authToken]);
  
//       if (user.length === 0) {
//         await rollback();
//         return res.status(400).send({
//           "message": "Login First."
//         })
//       } 
      
//       await query('DELETE FROM auth WHERE email = ?', [user[0].email]);
//       await query('DELETE FROM users WHERE auth_id = ?', [user[0].id]);
  
//       await commit();
  
//       return res.status(500).send({
//         message: "Successfully delete your account"
//       });
//     } catch (error) {
//       await rollback();
//       return res.status(500).send({
//         message: "Internal Server Error."
//       })
//     }
//   });
  
  
//   router.get('/users/:auth_token', async function(req, res) {
//     try {
//       const authToken = req.params.auth_token;
//       const user = await query('SELECT id, email, auth_token FROM auth WHERE auth_token = ?', [authToken]);
  
//       if (user.length === 0) {
//         return res.status(400).send({
//           message: "Login First."
//         })
//       }
      
//       const userData = await query('SELECT firstName, lastName, nid, profilePhoto, age, maritalStatus FROM users WHERE auth_id = ?', [user[0].id]);
//       res.json(userData);
//       res.status(200);
//     } catch (error) {
//       await rollback();
//       return res.status(500).send({
//         message: "Internal sever error."
//       })
//     }
//   });

//   module.exports = router;