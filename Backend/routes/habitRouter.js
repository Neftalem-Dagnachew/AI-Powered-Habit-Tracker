const express = require('express');
const router = express.Router();
const { implimentHabit, getCategories } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/categories', getCategories);

router.route('/')
    .post(createHabit)

module.exports = router;