const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

// Register new user (Admin creates)
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

module.exports = router;
