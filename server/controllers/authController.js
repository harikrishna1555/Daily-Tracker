const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
} = require("../models/userModel");
const crypto = require("crypto");
// replaced uuid.v4 usage with crypto.randomUUID()
const {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenByHash,
} = require("../models/refreshTokenModel");
const {
  createPasswordReset,
  findValidToken,
  markTokenUsed,
  revokeExistingTokensForUser,
} = require("../models/passwordResetModel");
const { sendEmail } = require("../utils/email");
const { createAuditLog } = require("../middleware/auditMiddleware");
const { updatePassword } = require("../models/userModel");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Existing user check
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser(name, email.toLowerCase(), passwordHash);

    // audit register
    try {
      await createAuditLog({
        userId: user.id,
        action: "REGISTER",
        tableName: "users",
        recordId: user.id,
        req,
      });
    } catch (e) {
      console.error("Audit error:", e);
    }

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmailWithPassword(email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    // Create refresh token
    const refreshToken = crypto.randomUUID();

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await saveRefreshToken(user.id, refreshTokenHash, expiresAt);

    // audit login
    try {
      await createAuditLog({
        userId: user.id,
        action: "LOGIN",
        tableName: "users",
        recordId: user.id,
        req,
      });
    } catch (e) {
      console.error("Audit error:", e);
    }

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedToken = await findRefreshToken(refreshTokenHash);

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: storedToken.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    res.json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await revokeRefreshTokenByHash(refreshTokenHash);

    // audit logout
    try {
      await createAuditLog({
        userId: req.user ? req.user.userId : null,
        action: "LOGOUT",
        tableName: "users",
        recordId: req.user ? req.user.userId : null,
        req,
      });
    } catch (e) {
      console.error("Audit error:", e);
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const user = await findUserByEmail(email.toLowerCase());

    // Always respond with success message to avoid email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }

    // revoke existing tokens for user
    await revokeExistingTokensForUser(user.id);

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // calculate expiry
    const expiresIn = process.env.PASSWORD_RESET_TOKEN_EXPIRES || "1h";
    const expiresAt = new Date();
    if (expiresIn.endsWith("h")) {
      const hours = parseInt(expiresIn.replace("h", ""), 10) || 1;
      expiresAt.setHours(expiresAt.getHours() + hours);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1);
    }

    await createPasswordReset(user.id, tokenHash, expiresAt);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const html = `<p>Hello ${user.name},</p><p>Click the link to reset your password (expires in ${expiresIn}):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

    try {
      await sendEmail(user.email, "Reset your password", html);
    } catch (e) {
      console.error("Email send failed", e);
    }

    // audit password reset request
    try {
      await createAuditLog({
        userId: user.id,
        action: "PASSWORD_RESET",
        tableName: "password_reset_tokens",
        recordId: null,
        req,
      });
    } catch (e) {
      console.error("Audit error:", e);
    }

    return res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const stored = await findValidToken(tokenHash);

    if (!stored) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await updatePassword(stored.user_id, passwordHash);

    await markTokenUsed(stored.id);

    // audit password reset completion
    try {
      await createAuditLog({
        userId: stored.user_id,
        action: "PASSWORD_RESET",
        tableName: "users",
        recordId: stored.user_id,
        req,
      });
    } catch (e) {
      console.error("Audit error:", e);
    }

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
