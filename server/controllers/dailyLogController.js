const {
  getTodayLogs: fetchTodayLogs,
  getLogsByDate: fetchLogsByDate,
  getLogById: fetchLogById,
  createLog,
  updateLog,
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
    const userId = req.user.userId;
    const { activityId, logDate, isCompleted } = req.body || {};

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid activity id is required",
      });
    }

    if (!isValidDateString(logDate)) {
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

    const exists = await logExists(userId, activityId, logDate);

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "A log for this activity and date already exists",
      });
    }

    const log = await createLog(
      userId,
      activityId,
      logDate,
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
  getLogsByDate,
  getDailyLogById,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
};
