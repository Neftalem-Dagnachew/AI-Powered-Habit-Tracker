const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

exports.registerUser = async (req, res, next) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            res.status(400);
            throw new Error("Required all data")
        }

        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            res.status(400);
            throw new Error("Email already registered");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await User.createUser({
            full_name,
            email,
            password: hashedPassword
        });

        const token = generateToken(userId);

        res.status(200).json({
            success: true,
            message: "User successfully registered",
            token,
            user: {
                id: userId,
                full_name,
                email
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400)
            throw new Error("Required all data")
        };

        const user = await User.findUserByEmail(email);
        if (!user) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
}