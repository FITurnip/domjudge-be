const express = require('express');
const authController = require('../services/auth'); // Import the controller

const router = express.Router();

// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

// Protected profile route
router.get('/profile', authController.getProfile);

module.exports = router;
