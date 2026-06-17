const express = require("express");
const router = express.Router();

const {
  getTabs,
  getTabById,
  createNewTab,
  updateTab,
  deleteTab,
} = require("../controllers/tabController");

const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, getTabs);
router.get("/:id", authenticate, getTabById);
router.post("/", authenticate, createNewTab);
router.put("/:id", authenticate, updateTab);
router.delete("/:id", authenticate, deleteTab);

module.exports = router;
