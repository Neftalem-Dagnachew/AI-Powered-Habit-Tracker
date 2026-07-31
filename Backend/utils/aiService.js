const axios = require('axios');

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'openrouter/free';

const BILINGUAL_INSTRUCTION = "Respond in English by default. However, if the user input or query is in Amharic, respond seamlessly in Amharic.";

const callGeminiAI = async (systemInstruction, userPrompt, jsonMode = false) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing from environment variables.");

        const fullSystemInstruction = `${systemInstruction}\n${BILINGUAL_INSTRUCTION}`;

        const payload = {
            model: MODEL_NAME,
            messages: [
                { role: 'system', content: fullSystemInstruction },
                { role: 'user', content: userPrompt }
            ]
        };

        if (jsonMode) {
            payload.response_format = { type: 'json_object' };
        }

        const response = await axios.post(OPENROUTER_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
                'X-Title': 'Habit Tracker App',
                'Content-Type': 'application/json'
            },
            timeout: 12000 // 12 seconds timeout
        });

        return response.data.choices[0]?.message?.content?.trim();
    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error.message);
        return null;
    }
};

exports.generateWeeklyReport = async (habitsSummary) => {
    const system = "You are an expert habit analyst. Analyze the user's performance and present a structured report in Markdown format highlighting Strengths, Weaknesses, and 3 Actionable Recommendations.";
    const prompt = `Here is the user's habit performance data for the last 7 days: ${JSON.stringify(habitsSummary)}`;
    
    const result = await callGeminiAI(system, prompt);
    return result || "### Weekly Progress Report\n* **Strengths:** Great effort in tracking your daily goals consistently.\n* **Recommendation:** Focus on prioritizing your core habits first in the coming week.";
};

exports.generateHabitWizard = async (userGoal) => {
    const system = `You are an expert habit architect. Based on the user's goal, generate 3 micro-habits.
    Return ONLY a raw JSON object with key "habits" as an array. Each item must have:
    - title (string in English by default, or Amharic if the goal was entered in Amharic)
    - frequency ("daily" or "weekly")
    - target_days (number)
    - color_hex (hex color string e.g. "#3B82F6")
    - icon_name (Lucide React icon string e.g. "Dumbbell", "BookOpen", "Droplet")`;

    const prompt = `User Goal: "${userGoal}"`;

    const result = await callGeminiAI(system, prompt, true);
    if (!result) {
        return {
            habits: [
                { title: "Read 1 page daily", frequency: "daily", target_days: 7, color_hex: "#10B981", icon_name: "BookOpen" },
                { title: "Drink 2 liters of water", frequency: "daily", target_days: 7, color_hex: "#3B82F6", icon_name: "Droplet" }
            ]
        };
    }
    try {
        return JSON.parse(result);
    } catch {
        return { habits: [] };
    }
};

exports.generateStreakRecovery = async (habitTitle, daysMissed) => {
    const system = "You are a Kaizen habit recovery coach. Provide a compassionate, non-judgmental 3-step action plan in Markdown to help the user rebuild momentum over the next 3 days.";
    const prompt = `Broken Habit: "${habitTitle}", Days Missed: ${daysMissed} day(s).`;

    const result = await callGeminiAI(system, prompt);
    return result || "### Streak Recovery Plan\n1. **Day 1:** Start micro (spend just 1 minute on the habit).\n2. **Day 2:** Build back up to 50% capacity.\n3. **Day 3:** Resume your full habit routine!";
};

exports.generateHabitChatResponse = async (habitsSummary, userQuestion) => {
    const system = "You are a friendly habit assistant. Analyze the user's habit database summary and provide a clear, concise, and helpful answer to their specific question.";
    const prompt = `User's overall habit data: ${JSON.stringify(habitsSummary)}\n\nUser Question: "${userQuestion}"`;

    const result = await callGeminiAI(system, prompt);
    return result || "I'm sorry, I couldn't analyze your habit data right now. Please try asking your question again.";
};

exports.generateMorningMotivation = async (userName, activeStreaks) => {
    const system = "You are an inspiring motivational coach. Write 1 short, powerful, and uplifting morning greeting incorporating the user's name and active streak count.";
    const prompt = `User Name: ${userName}, Active Streaks Count: ${activeStreaks}`;

    const result = await callGeminiAI(system, prompt);
    return result || `Good morning ${userName}! Today is a fresh start—keep building those habits and take another step toward your goals!`;
};