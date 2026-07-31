const db = require('../config/db');

exports.getUserHabitsSummary = async (userId) => {
    const query = `
        SELECT 
            h.id,
            h.habit_name AS title,
            h.category,
            h.frequency,
            h.target_days,
            COUNT(CASE WHEN l.status = 'completed' THEN 1 END) AS total_completed_logs
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id
        WHERE h.user_id = ?
        GROUP BY h.id, h.habit_name, h.category, h.frequency, h.target_days;
    `;

    const [rows] = await db.execute(query, [userId]);
    return rows;
};

exports.getBrokenHabitDetails = async (habitId, userId) => {
    const query = `
        SELECT 
            h.id,
            h.habit_name AS title,
            DATEDIFF(
                CURDATE(), 
                COALESCE(MAX(CASE WHEN l.status = 'completed' THEN l.log_date END), h.created_at)
            ) AS days_missed
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id
        WHERE h.id = ? AND h.user_id = ?
        GROUP BY h.id, h.habit_name, h.created_at;
    `;

    const [rows] = await db.execute(query, [habitId, userId]);
    return rows[0] || null;
};

exports.getCachedMotivation = async (userId) => {
    const [rows] = await db.query(
        "SELECT morning_motivation, last_motivation_date FROM users WHERE id = ?",
        [userId]
    );
    
    if (rows.length > 0 && rows[0].last_motivation_date) {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = new Date(rows[0].last_motivation_date).toISOString().split('T')[0];
        if (today === lastDate) {
            return rows[0].morning_motivation;
        }
    }
    return null;
};

exports.saveCachedMotivation = async (userId, motivationText) => {
    const today = new Date().toISOString().split('T')[0];
    await db.query(
        "UPDATE users SET morning_motivation = ?, last_motivation_date = ? WHERE id = ?",
        [motivationText, today, userId]
    );
};