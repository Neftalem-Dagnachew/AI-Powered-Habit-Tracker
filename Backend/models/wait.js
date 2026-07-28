exports.getAnalytics = async (habitId, userId) => {

    const [habit] = await db.query(
        "SELECT id, frequency, target_days, created_at FROM habits WHERE id = ? AND user_id = ?",
        [habitId, userId]
    );

    if (habit.length === 0) {
        throw new Error("HABIT_NOT_FOUND");
    }

    const { frequency, target_days, created_at } = habit[0];

    const streakQuery = `
        WITH RankedLogs AS (
            SELECT 
                habit_id,
                log_date,
                DATE_SUB(log_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY log_date) DAY) AS streak_group
            FROM habit_logs
            WHERE status = 'completed' AND habit_id = ?
        ),
        StreakLengths AS (
            SELECT 
                habit_id,
                MAX(log_date) AS streak_end,
                COUNT(*) AS streak_length
            FROM RankedLogs
            GROUP BY habit_id, streak_group
        )
        SELECT 
            COALESCE(MAX(streak_length), 0) AS longest_streak,
            COALESCE(
                MAX(CASE 
                    WHEN streak_end >= CURDATE() - INTERVAL 1 DAY THEN streak_length 
                    ELSE 0 
                END), 0
            ) AS current_streak
        FROM StreakLengths;
    `;

    const [streakResult] = await db.query(streakQuery, [habitId]);

    const [statsResult] = await db.query(`
        SELECT 
            COUNT(hl.id) AS completed_days,
            GREATEST(DATEDIFF(CURDATE(), h.created_at) + 1, 1) AS elapsed_days
        FROM habits h
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.status = 'completed'
        WHERE h.id = ?
        GROUP BY h.id;
    `, [habitId]);

    const completedDays = statsResult[0]?.completed_days || 0;
    const elapsedDays = statsResult[0]?.elapsed_days || 1;

    let targetExpectedDays = 0;

    if (frequency === 'daily') {
        const elapsedWeeks = Math.max(Math.ceil(elapsedDays / 7), 1);
        targetExpectedDays = Math.min(elapsedDays, elapsedWeeks * target_days);
    } else if (frequency === 'weekly') {
        const elapsedWeeks = Math.max(Math.ceil(elapsedDays / 7), 1);
        targetExpectedDays = elapsedWeeks * target_days;
    } else {
        targetExpectedDays = elapsedDays;
    }

    targetExpectedDays = Math.max(targetExpectedDays, completedDays, 1);

    const rawRate = (completedDays / targetExpectedDays) * 100;
    const completionRate = Math.min(Math.round(rawRate * 10) / 10, 100);

    return {
        habit_id: parseInt(habitId, 10),
        frequency,
        target_days,
        current_streak: streakResult[0]?.current_streak || 0,
        longest_streak: streakResult[0]?.longest_streak || 0,
        completed_days: completedDays,
        target_expected_days: targetExpectedDays,
        completion_rate: `${completionRate}%`
    };
};