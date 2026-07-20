const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.registerUser = async () => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            res.status(400);
            throw new Error("Required all data")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await User.createUser({
            full_name,
            email,
            password: hashedPassword
        });

        res.status(200).json({
            success: true,
            message: "User SucssesFully register",
            userId
        });
    } catch (error) {
        next(error);
    }
};