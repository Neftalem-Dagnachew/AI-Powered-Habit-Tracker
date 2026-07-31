const rateLimit = require('express-rate-limit');

exports.aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "The number of AI requests has exceeded. Please try again in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
})