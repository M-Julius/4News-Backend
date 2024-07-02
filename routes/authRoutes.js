const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST register new user
router.post('/register', userController.registerUser, userController.registerUserHandler);

// POST login user
router.post('/login', userController.loginUserHandler);


module.exports = router;
