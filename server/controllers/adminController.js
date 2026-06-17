const pool = require("../db/connection");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE is_deleted = false ORDER BY id DESC`,
    );

    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    if (!result.rows[0]) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM audit_logs ORDER BY performed_at DESC LIMIT 100`,
    );

    res.json({ success: true, logs: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsersQ = await pool.query(
      `SELECT COUNT(*) FROM users WHERE is_deleted = false`,
    );
    const totalTabsQ = await pool.query(
      `SELECT COUNT(*) FROM tabs WHERE is_deleted = false`,
    );
    const totalActivitiesQ = await pool.query(
      `SELECT COUNT(*) FROM activities WHERE is_deleted = false`,
    );
    const totalLogsQ = await pool.query(
      `SELECT COUNT(*) FROM daily_logs WHERE is_deleted = false`,
    );
    const todayLogsQ = await pool.query(
      `SELECT COUNT(*) FROM daily_logs WHERE DATE(created_at) = CURRENT_DATE`,
    );
    const activeUsersQ = await pool.query(
      `SELECT COUNT(DISTINCT user_id) FROM daily_logs WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'`,
    );

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsersQ.rows[0].count, 10),
        totalTabs: parseInt(totalTabsQ.rows[0].count, 10),
        totalActivities: parseInt(totalActivitiesQ.rows[0].count, 10),
        totalLogs: parseInt(totalLogsQ.rows[0].count, 10),
        todayLogs: parseInt(todayLogsQ.rows[0].count, 10),
        activeUsers: parseInt(activeUsersQ.rows[0].count, 10),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    // Simple aggregation for dashboard
    const q = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_deleted = false) AS total_users,
        (SELECT COUNT(*) FROM tabs WHERE is_deleted = false) AS total_tabs,
        (SELECT COUNT(*) FROM activities WHERE is_deleted = false) AS total_activities,
        (SELECT COUNT(*) FROM daily_logs WHERE is_deleted = false) AS total_logs
    `);

    res.json({ success: true, dashboard: q.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getAuditLogs,
  getStats,
  getDashboard,
};
