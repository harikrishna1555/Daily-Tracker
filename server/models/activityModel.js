const pool = require("../db/connection");

const getActivitiesByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT a.*
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE t.user_id = $1
      AND a.is_deleted = false
      AND t.is_deleted = false
    ORDER BY a.position
    `,
    [userId],
  );

  return result.rows;
};

const getActivitiesByTabId = async (userId, tabId) => {
  const result = await pool.query(
    `
    SELECT a.*
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE t.user_id = $1
      AND a.tab_id = $2
      AND a.is_deleted = false
      AND t.is_deleted = false
    ORDER BY a.position
    `,
    [userId, tabId],
  );

  return result.rows;
};

const getActivityById = async (userId, activityId) => {
  const result = await pool.query(
    `
    SELECT a.*
    FROM activities a
    JOIN tabs t ON a.tab_id = t.id
    WHERE t.user_id = $1
      AND a.id = $2
      AND a.is_deleted = false
      AND t.is_deleted = false
    `,
    [userId, activityId],
  );

  return result.rows[0];
};

const createActivity = async (userId, tabId, name, position) => {
  const result = await pool.query(
    `
    INSERT INTO activities (
      tab_id,
      name,
      position,
      created_by
    )
    SELECT t.id, $2, $3, $4
    FROM tabs t
    WHERE t.id = $1
      AND t.user_id = $4
      AND t.is_deleted = false
    RETURNING *
    `,
    [tabId, name, position, userId],
  );

  return result.rows[0];
};

const updateActivity = async (userId, activityId, name, position) => {
  const result = await pool.query(
    `
    UPDATE activities a
    SET name = $1,
        position = $2,
        updated_at = NOW(),
        updated_by = $4
    FROM tabs t
    WHERE a.tab_id = t.id
      AND t.user_id = $4
      AND a.id = $3
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING a.*
    `,
    [name, position, activityId, userId],
  );

  return result.rows[0];
};

const softDeleteActivity = async (userId, activityId) => {
  const result = await pool.query(
    `
    UPDATE activities a
    SET is_deleted = true,
        deleted_at = NOW(),
        deleted_by = $2
    FROM tabs t
    WHERE a.tab_id = t.id
      AND t.user_id = $2
      AND a.id = $1
      AND a.is_deleted = false
      AND t.is_deleted = false
    RETURNING a.*
    `,
    [activityId, userId],
  );

  return result.rows[0];
};

module.exports = {
  getActivitiesByUserId,
  getActivitiesByTabId,
  getActivityById,
  createActivity,
  updateActivity,
  softDeleteActivity,
};
