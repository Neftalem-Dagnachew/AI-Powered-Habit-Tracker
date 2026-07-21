const db = require('../config/db');

exports.createUser = async (userData) => {
    const { full_name, email, password } = userData;
    const [result] = await db.query(
        'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
        [full_name, email, password]
    );
    return result.insertId;
}

exports.findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

exports.getMe = async (userId) => {
    const [result] = await db.query(
        "SELECT id, full_name, email FROM users WHERE id = ?",
        [userId]
    );
    return result[0]
}

exports.updateProfile = async (userId, userData) => {
    const { full_name, email } = userData;

    await db.query(
        "UPDATE users SET full_name = ?, email = ? WHERE id = ?",
        [full_name, email, userId]
    );

    const [row] = await db.query(
        "SELECT id, full_name, email FROM users WHERE id = ?",
        [userId]
    );

    return row[0]
}
