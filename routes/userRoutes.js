const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);


// GET all users
router.get('/:id', userController.getUserById);

// POST register new user
router.post('/create', userController.registerUser, userController.registerUserHandler);

// PUT update user by ID
router.put('/:id', userController.updateUser, userController.updateUserHandler);

// DELETE user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
