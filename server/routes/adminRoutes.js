const express = require("express");
const router = express.Router();
const developerMiddleware = require("../middleware/developerMiddleware");
const {
  getUsers,
  getUserById,
  getAuditLogs,
  getStats,
  getDashboard,
} = require("../controllers/adminController");

router.use(developerMiddleware);

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.get("/audit-logs", getAuditLogs);
router.get("/stats", getStats);
router.get("/dashboard", getDashboard);

module.exports = router;
