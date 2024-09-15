// const express = require("express")
const { requireAuth ,requireSignin} = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const { register, login, currentUser, 
  editProfile,
   userRole, 
  verifyOtp,
  generateOtp,
  googleFacebookLogin,
  forgotPassword,
  resetPassword,
  verifyForgotPasswordOtp,
  generateOtpPhone,
  verifyOtpPhone,
  resetPasswordPhone,
  verifyRequest,
  loginByphone,
  
} = require("../controlar/userAuth.js");



// Other routes
router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register",  register);
router.post("/login", login);
router.post("/google-facebook-login", googleFacebookLogin);
router.post("/forget-password", forgotPassword);
router.post("/verify-forget-pass", verifyForgotPasswordOtp);
router.put("/reset-password", requireSignin, resetPassword);

// Phone authentication and login
router.post("/generate-otp-phone", generateOtpPhone);
router.post("/verify-otp-phone", verifyOtpPhone);
router.post("login-with-phone",loginByphone)
router.put("/update-password-phone",requireSignin,resetPasswordPhone)
router.put("/verify-user-request",requireSignin,verifyRequest)
// Profile route
router.get('/profile', requireSignin, currentUser);
router.put("/change-role",requireSignin,userRole);
router.put("/edit-profile",requireSignin,editProfile)
module.exports = router;
