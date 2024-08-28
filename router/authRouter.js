// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const { register, login, currentUser, 
  upDateProfile, uploadImage
  , userRole, 
  verifyOtp,
  generateOtp,
  googleFacebookLogin,
  forgotPassword,
  resetPassword,
  verifyForgotPasswordOtp,
  generateOtpPhone,
  verifyOtpPhone,
} = require("../controlar/userAuth.js");



// Other routes
router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", requireAuth, register);
router.post("/login", login);
router.post("/google-facebook-login", googleFacebookLogin);
router.post("/forget-password", forgotPassword);
router.post("/verify-forget-pass", verifyForgotPasswordOtp);
router.put("/reset-password", requireAuth, resetPassword);

// Phone authentication and login
router.post("/generate-otp-phone", generateOtpPhone);
router.post("/verify-otp-phone", verifyOtpPhone);

// Profile route
router.get('/profile', requireAuth, currentUser);

module.exports = router;
