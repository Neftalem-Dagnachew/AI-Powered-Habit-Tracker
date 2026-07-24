const Habit_logs = require('../models/habit_log');

exports.createLog = async (req, res, next) => {
    try {
        const habitId = req.params.id;
        const userId = req.user.id;

        const newLog = await Habit_logs.createHabitLog(habitId, userId, req.body);

        res.status(201).json({
            success: true,
            message: "Habit logged successfully",
            log: newLog
        });
    } catch (error) {
        next(error);
    }
};