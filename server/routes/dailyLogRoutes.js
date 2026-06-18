const express = require("express");
const router = express.Router();

const {
  getTodayLogs,
  getDailyLogs,
  getLogsByDate,
  getDailyLogById,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
} = require("../controllers/dailyLogController");

const { authenticate } = require("../middleware/authMiddleware");

router.get("/today", authenticate, getTodayLogs);
router.get("/", authenticate, getDailyLogs);
router.get("/date/:date", authenticate, getLogsByDate);
router.get("/:id", authenticate, getDailyLogById);
router.post("/", authenticate, createDailyLog);
router.put("/:id", authenticate, updateDailyLog);
router.delete("/:id", authenticate, deleteDailyLog);

module.exports = router;
