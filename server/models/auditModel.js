const pool = require("../db/connection");

const insertAuditLog = async ({
  userId,
  action,
  tableName,
  recordId,
  oldValue = null,
  newValue = null,
  changedFields = null,
  status = "SUCCESS",
  failureReason = null,
  ipAddress = null,
  userAgent = null,
  sessionId = null,
}) => {
  const result = await pool.query(
    `
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_value,
      new_value,
      changed_fields,
      status,
      failure_reason,
      ip_address,
      user_agent,
      session_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *
    `,
    [
      userId,
      action,
      tableName,
      recordId,
      oldValue,
      newValue,
      changedFields,
      status,
      failureReason,
      ipAddress,
      userAgent,
      sessionId,
    ],
  );

  return result.rows[0];
};

module.exports = {
  insertAuditLog,
};
