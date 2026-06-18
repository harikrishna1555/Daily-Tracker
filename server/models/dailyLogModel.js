const pool = require("../db/connection");

const getTodayLogs = async (userId) => {
  const result = await pool.query(
    `
    SELECT dl.*, a.name AS activity_name
    FROM daily_logs dl
    JOIN activities a ON dl.activity_id = a.id
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.user_id = $1
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
      AND dl.log_date = CURRENT_DATE
    ORDER BY dl.log_date DESC, dl.id
    `,
    [userId],
  );

  return result.rows;
};

const getAllLogs = async (userId) => {
  const result = await pool.query(
    `
    SELECT dl.*, a.name AS activity_name
    FROM daily_logs dl
    JOIN activities a ON dl.activity_id = a.id
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.user_id = $1
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    ORDER BY dl.log_date DESC, dl.id
    `,
    [userId],
  );

  return result.rows;
};

const getLogsByDate = async (userId, date) => {
  const result = await pool.query(
    `
    SELECT dl.*, a.name AS activity_name
    FROM daily_logs dl
    JOIN activities a ON dl.activity_id = a.id
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.user_id = $1
      AND dl.log_date = $2
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    ORDER BY dl.id
    `,
    [userId, date],
  );

  return result.rows;
};

const getLogById = async (userId, logId) => {
  const result = await pool.query(
    `
    SELECT dl.*, a.name AS activity_name
    FROM daily_logs dl
    JOIN activities a ON dl.activity_id = a.id
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.user_id = $1
      AND dl.id = $2
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    `,
    [userId, logId],
  );

  return result.rows[0];
};

const logExists = async (userId, activityId, logDate) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM daily_logs dl
    JOIN activities a ON dl.activity_id = a.id
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.user_id = $1
      AND dl.activity_id = $2
      AND dl.log_date = $3
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    LIMIT 1
    `,
    [userId, activityId, logDate],
  );

  return result.rows.length > 0;
};

const createLog = async (userId, activityId, logDate, isCompleted) => {
  const result = await pool.query(
    `
    INSERT INTO daily_logs (
      activity_id,
      user_id,
      log_date,
      is_completed,
      created_by
    )
    SELECT a.id, t.user_id, $2, $3, $4
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE a.id = $1
      AND t.user_id = $4
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING *
    `,
    [activityId, logDate, isCompleted, userId],
  );

  return result.rows[0];
};

const updateLog = async (userId, logId, isCompleted) => {
  const result = await pool.query(
    `
    UPDATE daily_logs dl
    SET is_completed = $1,
        updated_at = NOW(),
        updated_by = $3
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.activity_id = a.id
      AND dl.id = $2
      AND t.user_id = $3
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING dl.*
    `,
    [isCompleted, logId, userId],
  );

  return result.rows[0];
};

const updateLogByActivityAndDate = async (
  userId,
  activityId,
  logDate,
  isCompleted,
) => {
  const result = await pool.query(
    `
    UPDATE daily_logs dl
    SET is_completed = $1,
        updated_at = NOW(),
        updated_by = $4
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.activity_id = a.id
      AND a.id = $2
      AND dl.log_date = $3
      AND t.user_id = $4
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING dl.*
    `,
    [isCompleted, activityId, logDate, userId],
  );

  return result.rows[0];
};

const softDeleteLog = async (userId, logId) => {
  const result = await pool.query(
    `
    UPDATE daily_logs dl
    SET is_deleted = true,
        deleted_at = NOW(),
        deleted_by = $2
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE dl.activity_id = a.id
      AND t.user_id = $2
      AND dl.id = $1
      AND dl.is_deleted = false
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING dl.*
    `,
    [logId, userId],
  );

  return result.rows[0];
};

module.exports = {
  getTodayLogs,
  getLogsByDate,
  getLogById,
  getAllLogs,
  createLog,
  updateLog,
  updateLogByActivityAndDate,
  softDeleteLog,
  logExists,
};
