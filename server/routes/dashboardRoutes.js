const express = require("express");
const router = express.Router();

const {
  getTodayDashboard,
  getWeeklyDashboard,
  getMonthlyDashboard,
  getStreakStats,
} = require("../controllers/dashboardController");

const { authenticate } = require("../middleware/authMiddleware");

router.get("/today", authenticate, getTodayDashboard);

router.get("/week", authenticate, getWeeklyDashboard);

router.get("/month", authenticate, getMonthlyDashboard);

router.get("/streaks", authenticate, getStreakStats);

module.exports = router;
