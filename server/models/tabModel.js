const pool = require("../db/connection");

const getTabsByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM tabs
    WHERE user_id = $1
      AND is_deleted = false
    ORDER BY position
    `,
    [userId],
  );

  return result.rows;
};

const getTabByIdAndUser = async (tabId, userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM tabs
    WHERE id = $1
      AND user_id = $2
      AND is_deleted = false
    `,
    [tabId, userId],
  );

  return result.rows[0];
};

const createTab = async (userId, name, icon, position) => {
  const result = await pool.query(
    `
    INSERT INTO tabs (
      user_id,
      name,
      icon,
      position
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [userId, name, icon, position],
  );

  return result.rows[0];
};

const updateTabByIdAndUser = async (tabId, userId, name, icon, position) => {
  const result = await pool.query(
    `
    UPDATE tabs
    SET name = $1,
        icon = $2,
        position = $3,
        updated_at = NOW(),
        updated_by = $4
    WHERE id = $5
      AND user_id = $4
      AND is_deleted = false
    RETURNING *
    `,
    [name, icon, position, userId, tabId],
  );

  return result.rows[0];
};

const softDeleteTabByIdAndUser = async (tabId, userId) => {
  const result = await pool.query(
    `
    UPDATE tabs
    SET is_deleted = true,
        deleted_at = NOW(),
        deleted_by = $2
    WHERE id = $1
      AND user_id = $2
      AND is_deleted = false
    RETURNING *
    `,
    [tabId, userId],
  );

  return result.rows[0];
};

module.exports = {
  getTabsByUserId,
  getTabByIdAndUser,
  createTab,
  updateTabByIdAndUser,
  softDeleteTabByIdAndUser,
};
