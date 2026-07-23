const db = require('../config/db');

const ALLOWED_CATEGORIES = [
    "Health",
    "Fitness",
    "Learning",
    "Mindfulness",
    "Productivity",
    "Social",
    "Finance",
    "Creative",
    "Other"
];

exports.createHabit = async (userId, habitData) => {
    const { 
        habit_name, 
        description, 
        category, 
        frequency, 
        target_days, 
        icon, 
        color 
    } = habitData;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
        throw new Error(`Invalid category! Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`);
    }

    const [result] = await db.query(
        `INSERT INTO habits 
        (user_id, habit_name, description, category, frequency, target_days, icon, color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId, 
            habit_name, 
            description || null, 
            category || 'Other',
            frequency || 'daily', 
            target_days || 1, 
            icon || 'default-icon', 
            color || '#000000'
        ]
    );

    const [rows] = await db.query(
        "SELECT id, user_id, habit_name, description, category, frequency, target_days, icon, color, created_at FROM habits WHERE id = ?",
        [result.insertId]
    );

    return rows[0];
};

exports.getUserHabits = async (userId) => {
    const [rows] = await db.query(
        "SELECT id, habit_name, description, category, frequency, target_days, icon, color, created_at FROM habits WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

exports.updateHabits = async (habitId, userId, updateData) => {
    
    const { 
        habit_name,
        description,
        category, 
        frequency,
        target_days,
        icon,
        color
    } = updateData;

    const [resalt] = await db.query(
        `UPDATE habits SET 
            habit_name = ?, 
            description = ?, 
            category = ?, 
            frequency = ?, 
            target_days = ?,
            icon = ?, 
            color = ? 
            WHERE id = ? AND user_id = ?
        `,
        [
            habit_name, 
            description || null,
            category || 'Other',
            frequency || 'daily',
            target_days || 1,
            icon || 'default-icon',
            color || '#000000',
            habitId,
            userId
        ]
    );

    if(resalt.affectedRows == 0) {
        throw new Error("Habit not found or user not authorized")
    }

    const [updatedRows] = await db.query(
        "SELECT id, user_id, habit_name, description, category, frequency, target_days, icon, color, created_at FROM habits WHERE id = ?",
        [habitId]
    );

    return updatedRows[0];
};

exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;