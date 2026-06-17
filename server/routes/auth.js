const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const authSensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
const {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
} = require("../middleware/validationMiddleware");

const { auditMiddleware } = require("../middleware/auditMiddleware");

router.post("/register", authSensitiveLimiter, registerValidators, register);
router.post("/login", authSensitiveLimiter, loginValidators, login);
router.post("/refresh", refresh);
router.post("/logout", auditMiddleware, logout);
router.post(
  "/forgot-password",
  authSensitiveLimiter,
  forgotPasswordValidators,
  forgotPassword,
);
router.post("/reset-password", resetPasswordValidators, resetPassword);

module.exports = router;
