const express = require('express');
const router = express.Router();
const { implimentHabit, getCategories, UserHabits, updateHabit, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/categories', getCategories);

router.post('/', implimentHabit);

router.get('/', UserHabits);

router.put('/:id', updateHabit);

router.delete('/:id', deleteHabit);

module.exports = router;