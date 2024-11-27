const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helper/auth.js")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { generateOTP, sendOTP } = require("../helper/otp");
const logger = require("../utils/logger");
const sendOTPEmail = require("../helper/email");
const crypto = require('crypto');
const {sendVerificationEmail} =require("../helper/sendVerificationEmail")
const sendOtpSms = require('../helper/sendOtpSms'); // Adjust path as needed

exports.register = async (req, res) => {
  // console.log("register")
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
    // console.log("REGISTER FAILED => ", err);
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
      return res.status(400).json({ error: "User already  is exist in there " });
    }
    //  console.log(users);

    const hashedPassword = await hashPassword(password);
    // Create new user
    const otp = generateOTP();
    // user.otp = otp;
     const otpExpirescreate = Date.now() + 10 * 60 * 1000; 
    const user = new User({
      password: hashedPassword,
      email: email,
      otp : otp,
      otpExpires:otpExpirescreate,
    });
    await sendOTPEmail(email, otp); 

    // Save user
    await user.save();
      // Send OTP to user email
      console.log(otp)
    user.password = undefined;

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

  // logger.info(`OTP generation requested by ${email} from IP ${ipAddress}`);

  try {
    // Try to find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // logger.info(`User not found. Creating new user with email ${email}`);
      user = new User({
        email,
      });
      await user.save(); // Save the new user in the database
      // logger.info(`New user created with email ${email}`);
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  
    // Save the OTP and expiry time to the user record
    await user.save();

    // Send OTP to user email
    await sendOTPEmail(email, otp); // Make sure this function sends the email

    res.json({ message: "OTP sent successfully" });
    console.log(otp)
  } catch (err) {
    logger.error(`Error during OTP generation: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// exports.verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const user = await User.findOneAndUpdate({ email });
//   if (!user) {
//     logger.warn(`OTP verification failed: User not found with email ${email}`);
//     return res.status(400).json({ error: "User not found with this email" });
//   }
//   // console.log("verifyOtp",email,otp);

//   if (user.otp !== otp || user.otpExpires < Date.now()) {
//     logger.warn(`OTP verification failed: Invalid or expired OTP for email ${email}`);
//     return res.status(400).json({ error: "Invalid or expired OTP" });
//   }
 


//   user.otp = undefined;
//   user.isEmailVerified = true; 
//   user.isOtpVerified = true;
//   user.otpExpires = undefined;
  
//   user.markModified('otp');
//   user.markModified('isEmailVerified');
//   user.markModified('isOtpVerified');
//   user.markModified('otpExpires');
  
//   console.log("User object before save:", user);
//   await user.save();
//   console.log("User object after save:", user);
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   // Send a single response
//   res.json({
//     message: "OTP verified successfully",
//     token,
//     user,
//   });
// };


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found with this email" });
  }

  // Validate OTP and check expiry
  if (user.otp !== otp ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // Update the necessary fields
  user.otp = undefined;
  user.isEmailVerified = true; 
  user.isOtpVerified = true;
  user.otpExpires = undefined;

  // Save changes to the database
  await user.save();

  // Generate a JWT token
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
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { phone, email, fname, lname, name,
      varificationImage, varificationId, varificationIdType,
       about, fatherName, motherName, presentAddress, parmanentAddress, birth, profilePic, cover } = req.body;
    const userId = req.auth._id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
      user.isEmailVerified = false;
    }

    // Check phone uniqueness if phone is provided and different from current phone
    if (phone && phone !== user.phone) {
      const existingPhoneUser = await User.findOne({ phone, _id: { $ne: userId } });
      if (existingPhoneUser) {
        return res.status(400).json({ message: 'Phone number is already in use' });
      }
      user.phone = phone;
      user.isPhoneVerified = false; // Reset phone verification status
    }

    // Update other fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (name) user.name = name;
    if (about) user.about = about;
    if (fatherName) user.fatherName = fatherName;
    if (motherName) user.motherName = motherName;
    if (presentAddress) user.presentAddress = presentAddress;
    if (parmanentAddress) user.parmanentAddress = parmanentAddress;
    if (birth) user.birth = birth;
    if (profilePic) user.profilePic = profilePic;
    if (cover) user.cover = cover;
    if (varificationImage) user.varificationImage = varificationImage;
    if (varificationId) user.varificationId = varificationId;
    if (varificationIdType) user.varificationIdType = varificationIdType;
     
    // Save the updated user data
    await user.save();

    // Optional: Trigger email or phone verification steps if those fields were changed
    if (email && email !== user.email) {
      // Send email verification logic here
    }
    if (phone && phone !== user.phone) {
      // Send phone verification logic here
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

    user.role = 'host';
    await user.save();
    user.password = undefined;
    res.json({ message: 'Role updated to host successfully', user });
  } catch (error) {
    // console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.userRoleUser = async (req, res) => {
  const userId = req.auth._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.role = 'user';
    await user.save();
    user.password = undefined;
    res.json({ message: 'Role updated to host successfully', user });
  } catch (error) {
    // console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.googleFacebookLogin = async (req, res) => {
  try {
    const { name, email} = req.body;
    // console.log(req.body)
    let user = await User.findOne({ email });
    if (!user) {
      logger.info(`User not found. Creating new user with email ${email}`);
      user = new User({
        isEmailVerified:true,
        email,
        name,
        isOtpVerified: true,
        status: "active",
        isEmailVerified: true,
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });
    console.log("user",user)
    res.json({
      token,
      user,
    });
    
  } 
  catch (error) {
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
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 10000; // OTP valid for 10 minutes
    await user.save();
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email" ,email});
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
    if (user.otp !== otp ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    user.isEmailVerified = true; 
    await user.save();
    console.log("user")
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

  //  const userID=req.user._id ;
  //  console.log("test id",userID,req.user);

  try {
    const user = await User.findOne({email});
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
const normalizePhone = (phone) => {
  return phone.replace(/\D/g, '');
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
      user = new User({ phone: normalizedPhone });
      await user.save();
      logger.info(`New user created with phone ${normalizedPhone}`);
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
     console.log(otp)
    // logger.info(`OTP generated for ${normalizedPhone}: ${otp}`);

    // Send the OTP SMS
    const smsResponseCode = await sendOtpSms(normalizedPhone, otp);

    if (smsResponseCode === 202) {
      // logger.info(`OTP sent successfully to ${normalizedPhone}`);
      res.json({ message: "OTP sent successfully", phone: normalizedPhone });
    } else {
      logger.error(`Failed to send OTP to ${normalizedPhone}. API Response Code: ${smsResponseCode}`);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  } catch (err) {
    logger.error(`Error during OTP generation: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.verifyOtpPhone = async (req, res) => {
  const { phone, otp } = req.body;
  const normalizedPhone = normalizePhone(phone);
  const ipAddress = req.ip;

  // logger.info(`OTP verification attempted by ${normalizedPhone} from IP ${ipAddress}`);

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
    user.isPhoneVerified=true
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "OTP verified successfully", token, user });
  } catch (err) {
    logger.error(`Error during OTP verification: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPasswordPhone = async (req, res) => {
  const { phone, newPassword } = req.body;

   const {userID}=req.user._id ;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
    user.isEmailVerified = true;
    user.otp = undefined; // Clear the token
    user.otpExpires = undefined; // Clear the expiration time
    await user.save();

    return res.status(200).send("Email successfully verified.");
  } catch (error) {
    return res.status(500).send("Error verifying email. Try again.");
  }
};