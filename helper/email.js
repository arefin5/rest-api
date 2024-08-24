// helper/email.js

const nodemailer = require('nodemailer');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service you like, e.g., Gmail, Outlook
  auth: {
    user: 'arefintalukder5@gmail.com', // Your email address
    pass: 'nzvpycdcyoblvagq',  // Your email password or app-specific password if using Gmail
  },
});

// Function to send OTP email
const sendOTPEmail = async (toEmail, otp) => {
  console.log(otp)
  const mailOptions = {
    from: 'arefintalukder5@gmail.com',  // Sender address
    to: toEmail,                   // Receiver address
    subject: 'Your OTP Code',      // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${toEmail},otp`);
  } catch (error) {
    console.error(`Error sending OTP email: ${error}`);
    throw error;
  }
};

module.exports = sendOTPEmail;
