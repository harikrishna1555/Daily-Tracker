const pool = require("../db/connection");

const getTodayDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalActivitiesQuery = `
      SELECT COUNT(*) AS total
      FROM activities a
      JOIN tabs t ON a.tab_id = t.id
      WHERE t.user_id = $1
      AND a.is_deleted = false
      AND t.is_deleted = false
    `;

    const completedTodayQuery = `
      SELECT COUNT(*) AS completed
      FROM daily_logs dl
      WHERE dl.user_id = $1
      AND dl.log_date = CURRENT_DATE
      AND dl.is_completed = true
      AND dl.is_deleted = false
    `;

    const totalActivitiesResult = await pool.query(totalActivitiesQuery, [
      userId,
    ]);

    const completedTodayResult = await pool.query(completedTodayQuery, [
      userId,
    ]);

    const totalActivities = Number(totalActivitiesResult.rows[0].total);

    const completedToday = Number(completedTodayResult.rows[0].completed);

    const pendingToday = totalActivities - completedToday;

    const completionPercentage =
      totalActivities === 0
        ? 0
        : Math.round((completedToday / totalActivities) * 100);

    res.json({
      success: true,
      data: {
        totalActivities,
        completedToday,
        pendingToday,
        completionPercentage,
        todayDate: new Date().toISOString().split("T")[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWeeklyDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT
        log_date,
        COUNT(*) FILTER (
          WHERE is_completed = true
        ) AS completed
      FROM daily_logs
      WHERE user_id = $1
      AND is_deleted = false
      AND log_date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY log_date
      ORDER BY log_date
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: {
        startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        dailyBreakdown: result.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMonthlyDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT
        log_date,
        COUNT(*) FILTER (
          WHERE is_completed = true
        ) AS completed
      FROM daily_logs
      WHERE user_id = $1
      AND is_deleted = false
      AND DATE_TRUNC('month', log_date)
          = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY log_date
      ORDER BY log_date
    `;

    const result = await pool.query(query, [userId]);

    const now = new Date();

    res.json({
      success: true,
      data: {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        dailyBreakdown: result.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStreakStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT DISTINCT log_date
      FROM daily_logs
      WHERE user_id = $1
      AND is_completed = true
      AND is_deleted = false
      ORDER BY log_date ASC
    `;

    const result = await pool.query(query, [userId]);

    const dates = result.rows.map((row) => new Date(row.log_date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    currentStreak = longestStreak;

    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTodayDashboard,
  getWeeklyDashboard,
  getMonthlyDashboard,
  getStreakStats,
};
