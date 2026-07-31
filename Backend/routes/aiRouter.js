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

exports.generateHabitsFromGoal = async (req, res, next) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ success: false, message: "Please enter your purpose." });
        }

        const generatedData = await aiService.generateHabitWizard(goal);
        res.status(200).json({ success: true, data: generatedData });
    } catch (error) {
        next(error);
    }
};

exports.getStreakRecovery = async (req, res, next) => {
    try {
        const habitId = req.params.habitId;
        const userId = req.user.id;

        const habitDetails = await aiModel.getBrokenHabitDetails(habitId, userId);
        if (!habitDetails) {
            return res.status(404).json({ success: false, message: "Habit not found" });
        }

        const recoveryPlan = await aiService.generateStreakRecovery(
            habitDetails.title,
            habitDetails.days_since_last_log || 1
        );

        res.status(200).json({ success: true, recovery_plan: recoveryPlan });
    } catch (error) {
        next(error);
    }
};

exports.handleHabitChat = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: "Request not sent" });
        }

        const habitsSummary = await aiModel.getUserHabitsSummary(userId);
        const answer = await aiService.generateHabitChatResponse(habitsSummary, question);

        res.status(200).json({ success: true, answer });
    } catch (error) {
        next(error);
    }
};

exports.getMorningMotivation = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userName = req.user.name || "my darling";

        // ሀ) Check Cache
        const cachedMotivation = await aiModel.getCachedMotivation(userId);
        if (cachedMotivation) {
            return res.status(200).json({ success: true, motivation: cachedMotivation, cached: true });
        }

        const habitsSummary = await aiModel.getUserHabitsSummary(userId);
        const activeStreaksCount = habitsSummary.filter(h => h.completed_last_7_days > 0).length;

        const newMotivation = await aiService.generateMorningMotivation(userName, activeStreaksCount);

        await aiModel.saveCachedMotivation(userId, newMotivation);

        res.status(200).json({ success: true, motivation: newMotivation, cached: false });
    } catch (error) {
        next(error);
    }
};