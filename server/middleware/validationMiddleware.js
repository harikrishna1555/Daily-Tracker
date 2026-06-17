const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ param: e.param, msg: e.msg })),
    });
  }

  next();
};

const registerValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidation,
];

const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

const forgotPasswordValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  handleValidation,
];

const resetPasswordValidators = [
  body("token").notEmpty().withMessage("Token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidation,
];

module.exports = {
  handleValidation,
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
};
