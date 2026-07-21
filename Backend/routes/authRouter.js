const express = require('express');
const router = express.Router();
const { registerUser, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { updateProfile } = require('../models/user');
// (POST /api/auth/register)
router.post('/register', registerUser);

// (POST /api/auth/login)
router.post('/login', login);

router.get('/me', protect, getMe);

router.get('/profile', protect, updateProfile);

module.exports = router;