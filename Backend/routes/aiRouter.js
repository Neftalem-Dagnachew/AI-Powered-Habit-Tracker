const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
    getWeeklyReport,
    generateHabitsFromGoal,
    getStreakRecovery,
    handleHabitChat,
    getMorningMotivation
} = require('../controllers/aiController');

router.use(protect);
router.use(aiLimiter);

router.get('/weekly-report', getWeeklyReport);
router.post('/habit-wizard', generateHabitsFromGoal);
router.get('/streak-recovery/:habitId', getStreakRecovery);
router.post('/chat', handleHabitChat);
// router.get('/morning-motivation', getMorningMotivation);

module.exports = router;