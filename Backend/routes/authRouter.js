const express = require('express');
const router = express.Router();
const { registerUser, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
// (POST /api/auth/register)
router.post('/register', registerUser);

// (POST /api/auth/login)
router.post('/login', login);

router.get('/me', protect, getMe);

router.get('/profile', protect, updateProfile);

module.exports = router;