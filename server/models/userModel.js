const pool = require("../db/connection");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND is_deleted = false",
    [email],
  );

  return result.rows[0];
};

const createUser = async (name, email, passwordHash) => {
  const result = await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at
    `,
    [name, email, passwordHash],
  );

  return result.rows[0];
};
const findUserByEmailWithPassword = async (email) => {
  const result = await pool.query(
    `SELECT * 
     FROM users 
     WHERE email = $1 
     AND is_deleted = false`,
    [email],
  );

  return result.rows[0];
};
const updatePassword = async (userId, passwordHash) => {
  const result = await pool.query(
    `
    UPDATE users
    SET password_hash = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING id, name, email, role
    `,
    [passwordHash, userId],
  );

  return result.rows[0];
};
module.exports = {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
  updatePassword,
};
