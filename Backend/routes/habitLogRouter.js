const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

const { createLog, get_Log } = require('../controllers/habit_logController');

router.use(protect);

router.post('/:id/logs', createLog);

router.get('/:id/get-logs', get_Log)

module.exports = router;