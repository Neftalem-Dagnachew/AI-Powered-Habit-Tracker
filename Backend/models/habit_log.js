const { useId } = require('react');
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

exports.getHabit_log = async (habitId, userId) => {
    const [resalt] = await db.query(
        "SELECT * FROM habit_logs WHERE id = ?",
        [userId]
    );

    return resalt[0];
}

exports.getAnalytics = async (habitId, useId) => {

    const [habit] = await db.query(
        "SELECT id, frequency, target_days, created_at FROM habits WHERE id = ? AND user_id = ?",
        [habitId, useId]
    );

    if (habit.length === 0) {
        throw new Error("Habit Not Found")
    }

    const { frequency, target_days, created_at } = habit[0];

    const streakQuery =
    `
        WITH RankedLogs AS (
            SELECT
                habit_id,
                log_date,
                DATE_SUB(log_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY log_date) DAY) AS streak_group
            FROM habit_logs
            WHERE status = 'completed' AND habit_id = ?
        ),
        StreakLengths AS (
            SELECT
                habit_id,
                MAX(log_date) AS streak_end,
                COUNT(*) AS streak_length,
            FROM RankedLogs
            GROUP BY habit_id, streak_group
        )
        SELECT
            COALESCE(MAX(streak_length), 0) AS longest_streak,
            COALESCE(
                MAX(CASE
                    WHEN streak_end >= CURDATE() - INTERVAL 1 DAY THEN streak_length
                    ELSE 0
                END), 0
            ) AS current_streak
        FROM StreakLengths;
    `;

    const [streakResult] = await db.query(streakQuery, [habitId]);

    const [statsResult] = await db.query(`
        SELECT
            COUNT(hl.id) AS completed_days,
            GREATEST(DATEDIFF(CURDATE(), h.created_at) + 1, 1) AS elapsed_days
        FROM habits h
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.status = 'completed'
        WHERE h.id = ?
        GROUP BY h.id;
    `, [habitId]);

    
}