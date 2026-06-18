const {
  getTodayLogs: fetchTodayLogs,
  getLogsByDate: fetchLogsByDate,
  getLogById: fetchLogById,
  getAllLogs: fetchAllLogs,
  createLog,
  updateLog,
  updateLogByActivityAndDate,
  softDeleteLog,
  logExists,
} = require("../models/dailyLogModel");

const isValidDateString = (value) => {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const getTodayLogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await fetchTodayLogs(userId);

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLogsByDate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.params;

    if (!isValidDateString(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    const logs = await fetchLogsByDate(userId, date);

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDailyLogById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logId = Number(req.params.id);

    if (!Number.isInteger(logId) || logId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid log id",
      });
    }

    const log = await fetchLogById(userId, logId);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Daily log not found",
      });
    }

    return res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createDailyLog = async (req, res) => {
  try {
    console.log("Incoming Request:", req.body);
    const userId = req.user.userId;
    // Accept camelCase or snake_case from clients
    const body = req.body || {};
    const activityId = body.activityId ?? body.activity_id;
    const logDate = body.logDate ?? body.log_date;
    const isCompleted =
      typeof body.isCompleted !== "undefined"
        ? body.isCompleted
        : body.is_completed;

    // default logDate to today if not provided
    const todayStr = new Date().toISOString().slice(0, 10);
    const resolvedLogDate = logDate || todayStr;

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid activity id is required",
      });
    }

    if (!isValidDateString(resolvedLogDate)) {
      return res.status(400).json({
        success: false,
        message: "logDate must be in YYYY-MM-DD format",
      });
    }

    if (
      typeof isCompleted !== "undefined" &&
      typeof isCompleted !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean",
      });
    }

    console.log("is_completed:", isCompleted);
    const exists = await logExists(userId, activityId, resolvedLogDate);

    if (exists) {
      // update existing log to the requested completion value
      const updated = await updateLogByActivityAndDate(
        userId,
        activityId,
        resolvedLogDate,
        typeof isCompleted === "boolean" ? isCompleted : true,
      );
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Daily log not found or not owned by user",
        });
      }
      return res.json({ success: true, data: updated });
    }

    const log = await createLog(
      userId,
      activityId,
      resolvedLogDate,
      typeof isCompleted === "boolean" ? isCompleted : false,
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or not owned by user",
      });
    }

    return res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDailyLog = async (req, res) => {
  try {
    console.log("Daily Log Update Body:", req.body);
    const userId = req.user.userId;
    const logId = Number(req.params.id);
    const { isCompleted } = req.body || {};

    if (!Number.isInteger(logId) || logId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid log id",
      });
    }

    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean",
      });
    }

    const log = await updateLog(userId, logId, isCompleted);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Daily log not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDailyLog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logId = Number(req.params.id);

    if (!Number.isInteger(logId) || logId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid log id",
      });
    }

    const log = await softDeleteLog(userId, logId);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Daily log not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTodayLogs,
  // New endpoint to return all logs for the authenticated user
  getDailyLogs: async (req, res) => {
    try {
      const userId = req.user.userId;
      const logs = await fetchAllLogs(userId);

      return res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getLogsByDate,
  getDailyLogById,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
};
