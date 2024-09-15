const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helper/auth.js")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { generateOTP, sendOTP } = require("../helper/otp");
const logger = require("../utils/logger"); // Import the logger
const sendOTPEmail = require("../helper/email"); // Import the sendOTPEmail function


exports.register = async (req, res) => {
  console.log("start")
  const { name, password, email, birth } = req.body;
  // validation
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 characters long",
    });
  }
  try {
    const userId = req.body.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
      const hashedPassword = await hashPassword(password);
    }
    user.password = hashedPassword,
      user.name = name,
      user.birth = birth
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("REGISTER FAILED => ", err);
    return res.status(400).send("Error. Try again.");
  }
};
exports.generateOtp = async (req, res) => {
  const { email } = req.body;
  const ipAddress = req.ip;

  logger.info(`OTP generation requested by ${email} from IP ${ipAddress}`);

  try {
    // Try to find the user by email
    let user = await User.findOne({ email });

    // If the user does not exist, create a new user
    if (!user) {
      logger.info(`User not found. Creating new user with email ${email}`);
      user = new User({
        email,
      });
      await user.save(); // Save the new user in the database
      logger.info(`New user created with email ${email}`);
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save the OTP and expiry time to the user record
    await user.save();

    // Send OTP to user email
    await sendOTPEmail(email, otp); // Make sure this function sends the email

    logger.info(`OTP generated and sent to ${email}`);
    res.json({ message: "OTP sent successfully" });
    console.log(otp)
  } catch (err) {
    logger.error(`Error during OTP generation: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const ipAddress = req.ip;

  logger.info(`OTP verification attempted by ${email} from IP ${ipAddress}`);

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`OTP verification failed: User not found with email ${email}`);
    return res.status(400).json({ error: "User not found with this email" });
  }
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    logger.warn(`OTP verification failed: Invalid or expired OTP for email ${email}`);
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  user.isOtpVerified = true;
  user.status = "active";
  user.otpExpires = undefined;
  await user.save();

  logger.info(`OTP verified successfully for ${email}`);

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Send a single response
  res.json({
    message: "OTP verified successfully",
    token,
    user,
  });
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};
exports.SingleUser = async (req, res) => {
  // console.log("test ")
  try {
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
exports.editProfile = async (req, res) => {
  const userId = req.auth._id;
  try {
    const user = await User.findById(userId); // Fix: Remove the curly braces around userId
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Update user information
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.fatherName = req.body.fatherName || user.fatherName;
    user.motherName = req.body.motherName || user.motherName;
    user.presentAddress = req.body.presentAddress || user.presentAddress;
    user.parmanentAddress = req.body.parmanentAddress || user.parmanentAddress;
    user.birth = req.body.birth || user.birth;
    user.profilePic = req.body.profilePic || user.profilePic;
     user.cover=req.body.cover || user.cover;
    await user.save();
    // Exclude the password from the response
    user.password = undefined;
    // Send a response indicating success
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.userRole = async (req, res) => {
  const userId = req.auth._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set the role to 'host'
    user.role = 'Host';

    // Save the updated user document
    await user.save();

    // Exclude the password from the response
    user.password = undefined;

    // Send a response indicating success
    res.json({ message: 'Role updated to host successfully', user });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.googleFacebookLogin = async (req, res) => {
  try {
    const { name, email, birth } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      logger.info(`User not found. Creating new user with email ${email}`);
      user = new User({
        email,
        name,
        birth,
        isOtpVerified: true,
        status: "active",
        isVerified: true
      });
    }
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Send a single response
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }

}
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 10000; // OTP valid for 10 minutes
    // Save OTP to user record
    await user.save();

    // Send OTP to user email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Error in OTP verification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

   const {userID}=req.user._id ;
   console.log("test id",userID,req.user);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure OTP was verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in password reset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// otp for mobile and mobile singup and singin
exports.generateOtpPhone = async (req, res) => {
  const { phone } = req.body;
  const ipAddress = req.ip;

  logger.info(`OTP generation requested by ${phone} from IP ${ipAddress}`);

  try {
    // Try to find the user by phone
    let user = await User.findOne({ phone });

    // If the user does not exist, create a new user
    if (!user) {
      logger.info(`User not found. Creating new user with email ${phone}`);
      user = new User({
        phone,
      });
      await user.save(); // Save the new user in the database
      logger.info(`New user created with phone ${phone}`);
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save the OTP and expiry time to the user record
    await user.save();

    // Send OTP to user phone
    // await sendOTPEmail(email, otp); // Make sure this function sends the phone

    logger.info(`OTP generated and sent to ${phone}`);
    res.json({ message: "OTP sent successfully" });
    console.log(otp)
  } catch (err) {
    logger.error(`Error during OTP generation: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.verifyOtpPhone = async (req, res) => {
  const { phone, otp } = req.body;
  const ipAddress = req.ip;

  logger.info(`OTP verification attempted by ${phone} from IP ${ipAddress}`);

  const user = await User.findOne({ phone });
  if (!user) {
    logger.warn(`OTP verification failed: User not found with phone ${email}`);
    return res.status(400).json({ error: "User not found with this phone" });
  }
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    logger.warn(`OTP verification failed: Invalid or expired OTP for phone ${phone}`);
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  user.isOtpVerified = true;
  user.status = "active";
  user.otpExpires = undefined;
  await user.save();

  logger.info(`OTP verified successfully for ${phone}`);

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    message: "OTP verified successfully",
    token,
    user,
  });
};
exports.resetPasswordPhone = async (req, res) => {
  const { phone, newPassword } = req.body;

   const {userID}=req.user._id ;
  //  console.log("test id",userID,req.user);

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure OTP was verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in password reset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.loginByphone= async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({ error: "OTP not verified" });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

exports.verifyRequest=async (req, res) => {
  const { name,
    fatherName,
    motherName,
    idnumber,
    birth,
    presentAddress,
    parmanentAddress } = req.body;

    const userID = req.user._id; // Fix this to use _id from req.user

   console.log("test id",req.user);
   console.log("Test ID:", req.user._id);

  try {
    const user = await User.findOne({ _id: userID});

    // await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure OTP was verified
    // console.log("ok")
    // if (!user.isOtpVerified) {
    //   return res.status(400).json({ error: "OTP not verified" });
    // }

    // Hash the new password
    
    user.name=name,
    user.fatherName=fatherName,
    user.motherName=motherName,
    user.idnumber=idnumber,
    user.birth=birth,
    user.presentAddress=presentAddress ,
    user.parmanentAddress=parmanentAddress,

    // Update user password
    user.isOtpVerified = true; // Reset OTP verification status
    user.isVerified=true;
    await user.save();
    user.password=null 
    res.json({ message: "Password updated successfully",user });
  } catch (err) {
    console.error("Error in password reset:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
