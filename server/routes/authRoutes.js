const express = require("express");

const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");


// ===============================
// REGISTER
// ===============================

router.post("/register", register);


// ===============================
// VERIFY OTP
// ===============================

router.post("/verify-otp", verifyOTP);


// ===============================
// LOGIN
// ===============================

router.post("/login", login);


// ===============================
// FORGOT PASSWORD
// ===============================

router.post("/forgot-password", forgotPassword);


// ===============================
// RESET PASSWORD
// ===============================

router.post("/reset-password", resetPassword);


module.exports = router;
