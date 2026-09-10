const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply auth rate limiter for login and registration
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', authLimiter, resetPassword);

module.exports = router;
