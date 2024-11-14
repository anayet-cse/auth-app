const express = require('express');

const upload = require('../middleware/upload-photo')
const userController = require('../controllers/users');

const router = express.Router();

router.post('/', upload.single('profilePhoto'), userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:auth_token', userController.updateUser);
router.delete('/:auth_token', userController.deleteUser);
router.get('/:auth_token', userController.getUser);

module.exports = router;
