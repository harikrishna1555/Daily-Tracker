const developerMiddleware = (req, res, next) => {
  try {
    const secret = req.headers["x-developer-secret"];

    if (!secret || secret !== process.env.DEVELOPER_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = developerMiddleware;
