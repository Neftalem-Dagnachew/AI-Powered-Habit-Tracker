const db = require('../config/db');
const { formatToYYYYMMDD } = require('../utils/dateHelper');

exports.createHabitLog = async (habitId, userId, habitLogData = {}) => {
    const log_date = habitLogData.log_date 
        ? formatToYYYYMMDD(habitLogData.log_date) 
        : formatToYYYYMMDD();
        
    const status = habitLogData.status || 'completed';

    const [habit] = await db.query(
        "SELECT id FROM habits WHERE id = ? AND user_id = ?",
        [habitId, userId]
    );

    if (habit.length === 0) {
        throw new Error("Habit not found or user not authorized");
    }

    const [result] = await db.query(
        "INSERT INTO habit_logs (habit_id, log_date, status) VALUES (?, ?, ?)",
        [habitId, log_date, status]
    );

    const [newLog] = await db.query(
        "SELECT * FROM habit_logs WHERE id = ?",
        [result.insertId]
    );

    return newLog[0];
};