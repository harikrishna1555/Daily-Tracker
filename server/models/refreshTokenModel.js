const pool = require("../db/connection");

const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    `
    INSERT INTO refresh_tokens (
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

const findRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    `
    SELECT *
    FROM refresh_tokens
    WHERE token_hash = $1
      AND revoked = false
      AND is_deleted = false
    `,
    [tokenHash],
  );

  return result.rows[0];
};

const revokeRefreshToken = async (id) => {
  await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked = true,
        updated_at = NOW()
    WHERE id = $1
    `,
    [id],
  );
};
const revokeRefreshTokenByHash = async (tokenHash) => {
  await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked = true,
        updated_at = NOW()
    WHERE token_hash = $1
    `,
    [tokenHash],
  );
};

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenByHash,
};
