const db = require('../config/db');

exports.createUser = async (userData) => {
    const { full_name, email, password } = userData;
    const [result] = await db.query(
        'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
        [full_name, email, password]
    );
    return result.insertId;
}

exports.findAllUsers = async () => {
    const [rows] = db.query('SELECT id, full_name, email, created_at FROM users');
    return rows;
}

