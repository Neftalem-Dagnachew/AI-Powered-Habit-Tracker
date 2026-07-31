const db = require('../config/db');

exports.getUserHabitsSummary = async (userId) => {
    const query = `
        SELECT 
            h.id,
            h.title,
            h.frequency,
            h.target_days,
            COUNT(hl.id) AS total_completed_days,
            GREATEST(DATEDIFF(CURDATE(), h.created_at) + 1, 1) AS total_elapsed_days,
            SUM(CASE WHEN hl.log_date >= CURDATE() - INTERVAL 7 DAY THEN 1 ELSE 0 END) AS completed_last_7_days
        FROM habits h
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.status = 'completed'
        WHERE h.user_id = ?
        GROUP BY h.id;
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

exports.getBrokenHabitDetails = async (habitId, userId) => {
    const query = `
        SELECT h.id, h.title, h.frequency, h.target_days,
               DATEDIFF(CURDATE(), MAX(hl.log_date)) AS days_since_last_log
        FROM habits h
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.status = 'completed'
        WHERE h.id = ? AND h.user_id = ?
        GROUP BY h.id;
    `;
    const [rows] = await db.query(query, [habitId, userId]);
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