const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const Auth = require('../models/auth');
const User = require('../models/users');
const ApiResponseMessage = require('../utils/utils');

const SALT = 8;

const createUser = async (req, res) => {
  const { email, password, firstName, 
    lastName, nid, age, maritalStatus } = req.body;
  const profilePhoto = req.file.path;

  const existingUser = await Auth.findOne({ 
    where: { 
        email: email
    } 
  });
  if (existingUser) {
    return { status: 400, message: { 
      message: "Already registered with this email account." 
      } 
    };
  }

  const hashedPassword = bcrypt.hashSync(password, SALT);
  const authUser = await Auth.create({ 
    email, password: hashedPassword 
  });
  await User.create({ 
    auth_id: authUser.id, firstName, lastName, 
    nid, profilePhoto, age, maritalStatus 
  });

  return { status: 201, message: { 
    message: ApiResponseMessage.USER_CREATE 
    } 
  };
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await Auth.findOne({ 
    where: { 
        email: email 
    } 
  });

  if (!user) {
    return { status: 400, message: { 
      message: "Already registered with this email account." 
      } 
    };
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return { status: 400, data: { 
      message: 'Invalid email or password.' 
      } 
    };
  }

  const authToken = crypto.randomBytes(16).toString("hex");
  await Auth.update({ 
    auth_token: authToken 
      }, { 
        where: { 
          email: email 
        } 
    });
  return { status: 200, data: authToken };
};


const updateUser = async (req, res) => {
  const { auth_token } = req.params;
  const user = await Auth.findOne({ 
    where: { 
      auth_token 
    } 
  });

  if (!user) {
    return res.status(400).send({
        'message': 'Login First.'
    });
  }

  await User.update(req.body, { 
    where: { 
        auth_id: user.id 
    } 
  });
  return { status: 200, message: { 
    'message': ApiResponseMessage.USER_UPDATE 
    } 
  };
};


const deleteUser = async (req, res) => {
  const { auth_token } = req.params;
  const user = await Auth.findOne({ 
    where: { 
      auth_token 
    } 
  });
  if (!user) {
    return res.status(400).send({
        'message': 'Login First.'
    });
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

  return { status: 200, message: { 
    'message': 'Successfully delete your account' 
    } 
  };
};


const getUser = async (req, res) => {
  const { auth_token } = req.params;

  const user = await Auth.findOne({ 
    where: { 
      auth_token
    } 
  });
  if (!user) {
    return res.status(400).send({
       message: 'Login First.'
    });
  }

  const userData = await User.findOne({ 
    where: { 
      auth_id: user.id 
    } 
  });

  return { status: 200, data: userData };
};

module.exports = { createUser, loginUser, updateUser, deleteUser, loginUser};