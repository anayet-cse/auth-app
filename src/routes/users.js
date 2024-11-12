const path = require('path');
const multer = require('multer');
const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });


router.post('/', upload.single('profilePhoto'), userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:auth_token', userController.updateUser);
router.delete('/:auth_token', userController.deleteUser);
router.get('/:auth_token', userController.getUser);

module.exports = router;
