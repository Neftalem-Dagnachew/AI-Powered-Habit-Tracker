const aiModel = require('../models/aiModel');
const aiService = require('../utils/aiService');

exports.getWeeklyReport = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const habitsSummary = await aiModel.getUserHabitsSummary(userId);
        const report = await aiService.generateWeeklyReport(habitsSummary);

        res.status(200).json({ success: true, report });
    } catch (error) {
        next(error);
    }
};