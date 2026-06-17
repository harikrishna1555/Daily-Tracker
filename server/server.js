require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { sendEmail } = require("./utils/email");
const pool = require("./db/connection");
const authRoutes = require("./routes/auth");
const { authenticate } = require("./middleware/authMiddleware");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use("/api/auth", authRoutes);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
