const {
  getTabsByUserId,
  getTabByIdAndUser,
  createTab,
  updateTabByIdAndUser,
  softDeleteTabByIdAndUser,
} = require("../models/tabModel");

const getTabs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tabs = await getTabsByUserId(userId);

    return res.json({
      success: true,
      data: tabs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTabById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tabId = Number(req.params.id);

    if (!Number.isInteger(tabId) || tabId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tab id",
      });
    }

    const tab = await getTabByIdAndUser(tabId, userId);

    if (!tab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    return res.json({
      success: true,
      data: tab,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createNewTab = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, icon, position } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tab name is required",
      });
    }

    if (icon !== undefined && icon !== null && typeof icon !== "string") {
      return res.status(400).json({
        success: false,
        message: "Icon must be a string",
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

    const normalizedPosition = Number.isInteger(position) ? position : 0;

    const tab = await createTab(
      userId,
      name.trim(),
      icon ? icon.trim() : null,
      normalizedPosition,
    );

    return res.status(201).json({
      success: true,
      data: tab,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTab = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tabId = Number(req.params.id);
    const { name, icon, position } = req.body || {};

    if (!Number.isInteger(tabId) || tabId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tab id",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tab name is required",
      });
    }

    if (icon !== undefined && icon !== null && typeof icon !== "string") {
      return res.status(400).json({
        success: false,
        message: "Icon must be a string",
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

    const existingTab = await getTabByIdAndUser(tabId, userId);

    if (!existingTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    const normalizedPosition = Number.isInteger(position)
      ? position
      : existingTab.position;

    const updatedTab = await updateTabByIdAndUser(
      tabId,
      userId,
      name.trim(),
      icon !== undefined && icon !== null ? icon.trim() : existingTab.icon,
      normalizedPosition,
    );

    if (!updatedTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: updatedTab,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTab = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tabId = Number(req.params.id);

    if (!Number.isInteger(tabId) || tabId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tab id",
      });
    }

    const existingTab = await getTabByIdAndUser(tabId, userId);

    if (!existingTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found",
      });
    }

    const deletedTab = await softDeleteTabByIdAndUser(tabId, userId);

    if (!deletedTab) {
      return res.status(404).json({
        success: false,
        message: "Tab not found or already deleted",
      });
    }

    return res.json({
      success: true,
      data: deletedTab,
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
  getTabs,
  getTabById,
  createNewTab,
  updateTab,
  deleteTab,
};
