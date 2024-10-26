const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helper/auth.js")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { generateOTP, sendOTP } = require("../helper/otp");
const logger = require("../utils/logger"); // Import the logger
const sendOTPEmail = require("../helper/email"); // Import the sendOTPEmail function
const crypto = require('crypto');
const {sendVerificationEmail} =require("../helper/sendVerificationEmail")

exports.register = async (req, res) => {
  // console.log("start")
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
// normal user
exports.signup = async (req, res) => {
  const { password, email } = req.body;

  try {
    const users = await User.findOne({ email });
    // console.log(user);
    if (users) {
      return res.status(400).json({ error: "User  is exist in there " });
    }
     console.log(users);

    const hashedPassword = await hashPassword(password);
    // Create new user
    const user = new User({
      password: hashedPassword,
      email: email,
    });

    // Save user
    await user.save();

    // // Generate JWT token
    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    // Exclude password from the response
    user.password = undefined;

    // Send success response
    res.json({
      user,
    });

  } catch (err) {
    console.log("REGISTER FAILED => ", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
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
console.log(email,otp);

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
  try {
    const { phone, email } = req.body;
    const userId = req.auth._id;

    // If phone or email are non-empty, check uniqueness
    if (phone || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId }, // Exclude current user
        $or: [{ email: email }, { phone: phone }],
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or phone number already in use' });
      }
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Track changes for email and phone
    let emailChanged = false;
    let phoneChanged = false;

    // Update fields if they exist in req.body and are not empty strings
    if (req.body.fname) user.fname = req.body.fname;
    if (req.body.lname) user.lname = req.body.lname;
    if (req.body.name) user.name = req.body.name;

    if (req.body.email && req.body.email !== "") {
      if (user.email !== req.body.email) {
        user.email = req.body.email;
        user.isemailVerify = false; // Reset email verification status
        emailChanged = true;
      }
    }

    if (req.body.phone && req.body.phone !== "") {
      if (user.phone !== req.body.phone) {
        user.phone = req.body.phone;
        user.isPhoneVerified = false; // Reset phone verification status
        phoneChanged = true;
      }
    }
    if(req.body.about) user.about=req.body.about;
    if (req.body.fatherName) user.fatherName = req.body.fatherName;
    if (req.body.motherName) user.motherName = req.body.motherName;
    if (req.body.presentAddress) user.presentAddress = req.body.presentAddress;
    if (req.body.parmanentAddress) user.parmanentAddress = req.body.parmanentAddress;
    if (req.body.birth) user.birth = req.body.birth;
    if (req.body.profilePic) user.profilePic = req.body.profilePic;
    if (req.body.cover) user.cover = req.body.cover;

    // Save the updated user data
    await user.save();
console.log(user)
    // If email or phone was changed, notify the user (optional)
    if (emailChanged) {
      // Send email verification logic can go here (e.g., send email)
    }
    if (phoneChanged) {
      // Send OTP or phone verification logic can go here (e.g., SMS OTP)
    }

    // Return success response
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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
    user.role = 'host';

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
    // console.log(user);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 10000; // OTP valid for 10 minutes
    // Save OTP to user record
    await user.save();
    console.log("otp forget",otp)
    // Send OTP to user email
    // await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email" ,email});
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email)

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
     console.log(user);
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;

    await user.save();
    console.log(user)
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
  const { email, password } = req.body;

   const {userID}=req.user._id ;
   console.log("test id",userID,req.user);

  try {
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure OTP was verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

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
const normalizePhone = (phone) => {
  return phone.replace(/\D/g, ''); // Removes all non-digit characters
};


exports.generateOtpPhone = async (req, res) => {
  const { phone } = req.body;
  const normalizedPhone = normalizePhone(phone);
  const ipAddress = req.ip;

  logger.info(`OTP generation requested by ${normalizedPhone} from IP ${ipAddress}`);

  try {
    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      logger.info(`User not found. Creating new user with phone ${normalizedPhone}`);
      user = new User({
        phone: normalizedPhone,
      });
      await user.save();
      logger.info(`New user created with phone ${normalizedPhone}`);
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    logger.info(`OTP generated and sent to ${normalizedPhone} ${otp}`);
    res.json({ message: "OTP sent successfully", phone: normalizedPhone });
    console.log(otp)
  } catch (err) {
    logger.error(`Error during OTP generation: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtpPhone = async (req, res) => {
  const { phone, otp } = req.body;
  const normalizedPhone = normalizePhone(phone);
  const ipAddress = req.ip;

  logger.info(`OTP verification attempted by ${normalizedPhone} from IP ${ipAddress}`);

  try {
    const user = await User.findOne({ phone: normalizedPhone });
    
    if (!user) {
      logger.warn(`OTP verification failed: User not found with phone ${normalizedPhone}`);
      return res.status(400).json({ error: "User not found with this phone" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      logger.warn(`OTP verification failed: Invalid or expired OTP for phone ${normalizedPhone}`);
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
// console.log(user);

    user.otp = undefined;
    user.isOtpVerified = true;
    user.status = "active";
    user.otpExpires = undefined;
    user.isPhoneVerified=true;

    await user.save();
    logger.info(`OTP verified successfully for ${normalizedPhone}`);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "OTP verified successfully", token, user });
    console.log(user);
  } catch (err) {
    logger.error(`Error during OTP verification: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Generate a verification token (could be a simple token or OTP)
    const token = crypto.randomBytes(20).toString('hex');
    
    // Set the token and expiration time (e.g., 1 hour)
    user.otp = token;
    user.otpExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Construct a verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify/${token}`;

    // Send verification email with the link
    // await sendVerificationEmail(user.email, verificationUrl);
      console.log(user.email,verificationUrl)
    return res.status(200).send("Verification email sent. Please check your inbox.");
  } catch (error) {
    return res.status(500).send("Error. Try again.");
  }
};
// Route to verify email based on the token
exports.confirmEmailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by the token and ensure it's not expired
    const user = await User.findOne({
      otp: token,
      otpExpires: { $gt: Date.now() } // Check that the token is not expired
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    // Update user as verified
    user.isemailVerify = true;
    user.otp = undefined; // Clear the token
    user.otpExpires = undefined; // Clear the expiration time
    await user.save();

    return res.status(200).send("Email successfully verified.");
  } catch (error) {
    return res.status(500).send("Error verifying email. Try again.");
  }
};