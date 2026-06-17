const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  res
    .status(500)
    .json({ success: false, message: err.message || "Server error" });
};

module.exports = errorHandler;
