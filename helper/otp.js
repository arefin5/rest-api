const crypto = require("crypto");

// Function to generate a random OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

// Function to send the OTP (for example, via email or SMS)
const sendOTP = async (email, otp) => {
  // Implement your email or SMS sending logic here
  // For example, using a service like Twilio or SendGrid
  console.log(`Sending OTP ${otp} to ${email}`);
};

module.exports = { generateOTP, sendOTP };
