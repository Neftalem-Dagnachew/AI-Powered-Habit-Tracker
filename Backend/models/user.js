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

exports.getMe = async () => {
    const [result] = await db.query(
        "SELECT id, full_name, email FROM users WHERE id = ?",
        [userId]
    );
    return result[0]
}
