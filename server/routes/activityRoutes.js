const express = require("express");
const router = express.Router();

const {
  getActivities,
  getActivity,
  getActivitiesByTab,
  createNewActivity,
  updateExistingActivity,
  deleteActivity,
} = require("../controllers/activityController");

const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, getActivities);
router.get("/:id", authenticate, getActivity);
router.get("/tabs/:tabId/activities", authenticate, getActivitiesByTab);
router.post("/", authenticate, createNewActivity);
router.put("/:id", authenticate, updateExistingActivity);
router.delete("/:id", authenticate, deleteActivity);

module.exports = router;
