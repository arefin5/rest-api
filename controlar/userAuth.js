const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helper/auth.js")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { generateOTP, sendOTP } = require("../helper/otp");
const logger = require("../utils/logger"); // Import the logger
const sendOTPEmail = require("../helper/email"); // Import the sendOTPEmail function

const cloudinary = require("cloudinary")
cloudinary.config({
  cloud_name: "arefintalukder5",
  api_key: "622592679337996",
  api_secret: "lQqwTTsKLLgm0F3_yasknj-jefg",
});

exports.register = async (req, res) => {
  const { name, password, email,birth,} = req.body;
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
    user.name=name,
    user.birth=birth
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
    res.json({ message: "OTP sent successfully"});
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
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
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
exports.currentUser = async (req, res) => {
  // console.log("test ")
  try {
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
exports.upDateProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId); // Fix: Remove the curly braces around userId
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Update user information
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.father = req.body.father;
    user.mother = req.body.mother;
    user.paddress = req.body.paddress;
    user.parent = req.body.permanent;
    user.education = req.body.education;
    user.image = req.body.image;
 
    // Save the updated user document
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
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    // console.log(req.body); // Check the entire request body

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    if (req.body.role) {
      user.role = req.body.role;
    }

    if (req.body.branch) {
      user.branch = req.body.branch;
    }

    // Save the updated user document
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
exports.uploadImage = async (req, res) => {
  // console.log("req files => ",req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log("uploaded image url => ", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};
