const {
  getActivitiesByUserId,
  getActivitiesByTabId,
  getActivityById,
  createActivity,
  updateActivity,
  softDeleteActivity,
} = require("../models/activityModel");

const getActivities = async (req, res) => {
  try {
    const userId = req.user.userId;
    const activities = await getActivitiesByUserId(userId);

    return res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const activityId = Number(req.params.id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity id",
      });
    }

    const activity = await getActivityById(userId, activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivitiesByTab = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tabId = Number(req.params.tabId);

    if (!Number.isInteger(tabId) || tabId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tab id",
      });
    }

    const activities = await getActivitiesByTabId(userId, tabId);

    return res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createNewActivity = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const userId = req.user.userId;
    // accept tabId or tab_id from clients
    const { tabId, tab_id, name, position } = req.body || {};
    const resolvedTabId = tabId ?? tab_id;

    if (!Number.isInteger(resolvedTabId) || resolvedTabId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid tab id is required",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Activity name is required",
      });
    }

    if (
      position !== undefined &&
      position !== null &&
      !Number.isInteger(position)
    ) {
      return res.status(400).json({
        success: false,
        message: "Position must be an integer",
      });
    }

    const activity = await createActivity(
      userId,
      resolvedTabId,
      name.trim(),
      Number.isInteger(position) ? position : 0,
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Tab not found or not owned by user",
      });
    }

    return res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateExistingActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const activityId = Number(req.params.id);
    const { name, position } = req.body || {};

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity id",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Activity name is required",
      });
    }

    if (
      position !== undefined &&
      position !== null &&
      !Number.isInteger(position)
    ) {
      return res.status(400).json({
        success: false,
        message: "Position must be an integer",
      });
    }

    const activity = await updateActivity(
      userId,
      activityId,
      name.trim(),
      Number.isInteger(position) ? position : null,
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const activityId = Number(req.params.id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity id",
      });
    }

    const activity = await softDeleteActivity(userId, activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: activity,
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
  getActivities,
  getActivity,
  getActivitiesByTab,
  createNewActivity,
  updateExistingActivity,
  deleteActivity,
};
