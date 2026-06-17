const pool = require("../db/connection");

const createPasswordReset = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    `
    INSERT INTO password_reset_tokens (
      user_id,
      token_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, tokenHash, expiresAt],
  );

  return result.rows[0];
};

const findValidToken = async (tokenHash) => {
  const result = await pool.query(
    `
    SELECT *
    FROM password_reset_tokens
    WHERE token_hash = $1
      AND used = false
      AND expires_at > NOW()
      AND is_deleted = false
    `,
    [tokenHash],
  );

  return result.rows[0];
};

const markTokenUsed = async (id) => {
  const result = await pool.query(
    `
    UPDATE password_reset_tokens
    SET used = true,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const revokeExistingTokensForUser = async (userId) => {
  await pool.query(
    `
    UPDATE password_reset_tokens
    SET used = true,
        updated_at = NOW()
    WHERE user_id = $1
      AND used = false
    `,
    [userId],
  );
};

module.exports = {
  createPasswordReset,
  findValidToken,
  markTokenUsed,
  revokeExistingTokensForUser,
};
