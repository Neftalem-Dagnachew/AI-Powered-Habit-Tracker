const Habit = require('../models/habit');

exports.implimentHabit = async (req, res, next) => {
    try {
        const { habit_name, description, category, frequency, target_days, icon, color } = req.body;
        const userId = req.user.id;

        if(!habit_name || habit_name.trim() === '') {
            res.status(400);
            throw new Error("Habit name is required");
        }

        const newHabit = await Habit.createHabit(userId, {
            habit_name: habit_name.trim(),
            description,
            category,
            frequency,
            target_days,
            icon,
            color
        });

        res.status(201).json({
            success: true,
            message: "Habit created successfully",
            habit: newHabit
        });

    } catch(error) {
        next(error)
    }
}

exports.UserHabits = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if(!userId) {
            res.status(404);
            throw new Error("User Not Found");
        }

        const habits = await Habit.getUserHabits(userId);

        res.status(200).json({
            success: true,
            count: habits.length,
            habits
        })
    } catch(error) {
        next(error)
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            categories: Habit.ALLOWED_CATEGORIES
        });
    } catch (error) {
        next(error);
    }
};

exports.updateHabit = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;

        if(!userId || !habitId) {
            res.status(400)
            throw new Error("User not found");
        };

        const updatedHabit = await Habit.updateHabits(habitId, userId, req.body);

        res.status(200).json({
            success: true,
            message: "Habit updated successfully",
            habit: updatedHabit
        });

    } catch(error) {
        next(error)
    }
}