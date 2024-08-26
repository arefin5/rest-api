const express = require("express")
const { requireAuth } = require("../midleware/auth")
const router = express.Router();
// const { checkAdmin } = require("../midleware/admin");
// const { checkStudent } = require("../midleware/student.js")
// controllers
const formidable = require("express-formidable")
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
  verifyOtpPhone
} = require("../controlar/userAuth.js");
// router.post(
//   "/upload-image-file",
//   formidable({ maxFileSize: 5 * 1024 * 1024 }),
//   uploadImage
// );

// Route to generate OTP
router.post("/generate-otp", generateOtp);

// Route to verify OTP
router.post("/verify-otp", verifyOtp);
router.post("/register", requireAuth,register);
router.post("/login", login);

router.post("/gogle-facebook-login",googleFacebookLogin)
router.post("/forget-password", forgotPassword);
router.post("/verify-forget-pass", verifyForgotPasswordOtp);
router.put("/reset-password", requireAuth,resetPassword);
//phone auth and loging
router.post("/generete-otp-phone", generateOtpPhone);
router.post("/verify-otp-phone",verifyOtpPhone)
router.get('/profile', requireAuth, currentUser);


module.exports = router;