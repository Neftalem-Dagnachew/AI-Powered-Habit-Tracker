const express = require('express');
const router = express.Router();
const { implimentHabit, getCategories, UserHabits } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/categories', getCategories);

router.post('/', implimentHabit);

router.get('/', UserHabits);

module.exports = router;