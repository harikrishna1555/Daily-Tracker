require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { sendEmail } = require("./utils/email");
const pool = require("./db/connection");
const authRoutes = require("./routes/auth");
const { authenticate } = require("./middleware/authMiddleware");
const { auditMiddleware } = require("./middleware/auditMiddleware");
const adminRoutes = require("./routes/adminRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const tabRoutes = require("./routes/tabRoutes");
const activityRoutes = require("./routes/activityRoutes");
const dailyLogRoutes = require("./routes/dailyLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use(
  cors({
    origin: "https://dt3575.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(auditMiddleware);
app.use("/api/auth", authRoutes);
app.use("/api/tabs", tabRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/logs", dailyLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Daily Tracker API is running",
  });
});

const PORT = process.env.PORT || 5000;
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "harikrishna1555@gmail.com",
      "Daily Tracker Test",
      "<h1>Resend is working!</h1><p>Your email system is configured correctly.</p>",
    );

    res.json({
      success: true,
      message: "Test email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.use("/api/auth", authRoutes);
app.get("/profile", authenticate, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
app.get("/ping", (req, res) => {
  res.json({ success: true });
});
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
