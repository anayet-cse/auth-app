const userService = require('../services/users');
const ApiResponseMessage = require('../utils/utils');


exports.createUser = async (req, res) => {
  try {
    const response = await userService.createUser(req);
    res.status(response.status).send(response.message);

  } catch (error) {
    console.log(error);

    res.status(500).send({ 
        message: ApiResponseMessage.SYSTEM_ERROR 
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const response = await userService.loginUser(req);
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.log(error);

    res.status(500).json({ 
        message: "Internal Server Error." 
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const response = await userService.updateUser(req);
    res.status(response.status).send(response.message);
  } catch (error) {
    console.log(error);

    res.status(500).json({ 
        error: "Internal Server Error." 
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const response = await userService.deleteUser(req);
    res.status(response.status).send(response.message);
  } catch (error) {
    console.log(error);

    res.status(500).send({ 
        message: "Internal Server Error." 
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const response = await userService.getUser(req);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);

    res.status(500).send({ 
        message: "Internal Server Error." 
    });
  }
};
