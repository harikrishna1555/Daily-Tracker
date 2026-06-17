const { insertAuditLog } = require("../models/auditModel");

const createAuditLog = async ({
  userId,
  action,
  tableName = null,
  recordId = null,
  oldValue = null,
  newValue = null,
  changedFields = null,
  status = "SUCCESS",
  failureReason = null,
  req = null,
}) => {
  try {
    const ipAddress = req
      ? req.ip || req.headers["x-forwarded-for"] || null
      : null;
    const userAgent = req ? req.get("user-agent") : null;

    return await insertAuditLog({
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
      sessionId: req ? req.headers["session-id"] || null : null,
    });
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
};

// middleware to attach helper to req
const auditMiddleware = (req, res, next) => {
  req.createAuditLog = (params) =>
    createAuditLog(Object.assign({}, params, { req }));

  next();
};

module.exports = {
  createAuditLog,
  auditMiddleware,
};
