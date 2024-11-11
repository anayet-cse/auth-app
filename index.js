const util = require('util');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('./src/config/db');
const bodyParser = require('body-parser');
const ApiResponseMessage = require('./utils/utils');
const User = require('./src/models/users');
const Auth = require('./src/models/auth');

const port = process.env.PORT || 3000;

const SALT = 8;

const app = express();
app.use(bodyParser.json());

async function dbConeection(params) {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}
dbConeection()

app.listen(3000);

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


app.post('/users', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { filename } = req.file;
    const filePath = __dirname + '/' + filename;

    const userEmail = await Auth.findOne({ 
      where: { 
        email: req.body.email 
      } 
    });
    if (userEmail) {
      return res.status(400).send({
        "message": "Already registered with this email account."
      });
    }

    const hashPassword = await bcrypt.hashSync(req.body.password, SALT);
    const authUser = await Auth.create({
      email: req.body.email,
      password: hashPassword,
    });

    const user = await User.create({
      auth_id: authUser.id, firstName: req.body.firstName, lastName: req.body.lastName,
      nid: req.body.nid, profilePhoto: filePath, age: req.body.age, 
      maritalStatus: req.body.maritalStatus 
    });

    return res.status(201).send({
      "message": ApiResponseMessage.USER_CREATE
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      "message": ApiResponseMessage.SYSTEM_ERROR
    });
  }
});


app.post('/users/login', async function (req, res) {
  try {
    const user = await Auth.findOne({
       where: { 
        email: req.body.email 
      } 
    });
    if (!user) {
      return res.status(400).send({
        'message': 'There is no account with this email.'
      })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password, user.password
    );
    if (!passwordIsValid) {
      return res.status(400).send({
        'message': 'Invalid email or password.'
      });
    }

    const authToken = crypto.randomBytes(16).toString("hex");
    await Auth.update({
      auth_token: authToken
    }, { 
      where: { 
        email: req.body.email 
      }
    });

    res.status(200).json(authToken);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ 
      "message": "Internal Server Error." 
    });
  }
})


app.put('/users/:auth_token', async function (req, res) {
  try {
    const user = await Auth.findOne({ 
      where: { 
        auth_token: req.params.auth_token 
      } 
    });
    if (!user) {
      return res.status(400).send({
        "message": "Login First."
      })
    }

    await User.update(req.body, { 
      where: { 
        auth_id: user.id 
      }
    });

    res.status(200).send({
      message: ApiResponseMessage.USER_UPDATE
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ 
      error: "Internal Server Error." 
    });
  }
});


app.delete('/users/:auth_token', async function (req, res) {
  try {
    const user = await Auth.findOne({ 
      where: { 
        auth_token: req.params.auth_token 
      } 
    });
    if (!user) {
      return res.status(400).send({
        "message": "Login First."
      })
    }

    await Auth.destroy({ 
      where: { 
        email: user.email 
      } 
    });
    await User.destroy({ 
      where: { 
        auth_id: user.id 
      } 
    });

    return res.status(200).send({
      message: "Successfully delete your account"
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).send({
      message: "Internal Server Error."
    });
  }
});


app.get('/users/:auth_token', async function (req, res) {
  try {
    const user = await Auth.findOne({ 
      where: { 
        auth_token: req.params.auth_token 
      } 
    });
    if (!user) {
      return res.status(400).send({
        message: "Login First."
      })
    }

    const userData = await User.findOne({ 
      where: { 
        auth_id: user.id 
      } 
    });

    res.json(userData);
    res.status(200);
  } catch (error) {
    console.log(error);
    
    return res.status(500).send({
      message: "Internal sever error."
    })
  }
});

// module.exports = app;