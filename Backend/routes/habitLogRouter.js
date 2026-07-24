const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

const { createLog } = require('../controllers/habit_logController');

router.use(protect);

router.post('/:id/logs', createLog);

module.exports = router;