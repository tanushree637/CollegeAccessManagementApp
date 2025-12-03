const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  changePassword,
} = require('../controllers/authController');

// Register new user (Admin creates)
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Change password
router.post('/change-password', changePassword);

module.exports = router;
