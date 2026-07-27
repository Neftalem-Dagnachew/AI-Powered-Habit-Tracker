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

exports.get_Log = async (req, res, next) => {
    try {
        const habitId = req.params.id;
        const userId = req.user.id;

        const newHabit_log = await Habit_logs.getHabit_log(habitId, userId, req.body);

        res.status(200).json({
            success: true,
            log: newHabit_log 
        })
    } catch (error) {
        next(error)
    }
}

exports.getAnalytics = async (req, res, next) => {
    try {
        const habitId = req.params.id;
        const userId = req.user.id;

        const analyticsData = await Habit_logs.getAnalytics(habitId, userId);

        res.status(200).json({
            success: true,
            data: analyticsData
        });
    } catch (error) {
        if (error.message === "HABIT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Habit not found or user unauthorized"
            });
        }
        next(error);
    }
};