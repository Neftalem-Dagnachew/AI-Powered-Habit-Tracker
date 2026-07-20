const express = require('express');
const router = express.Router();
const { registerUser, login } = require('../controllers/authController');

// (POST /api/auth/register)
router.post('/register', registerUser);

// (POST /api/auth/login)
router.post('/login', login);

module.exports = router;