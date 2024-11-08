// // helper/email.js

// const nodemailer = require('nodemailer');

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // You can use any email service you like, e.g., Gmail, Outlook
//   auth: {
//     user: 'booking@bedbd.com', // Your email address
//     pass: 'Jz2qIGU:&',  // how to generete this 
//   },
// });

// // Function to send OTP email
// const sendOTPEmail = async (toEmail, otp) => {
//   console.log(otp)
//   const mailOptions = {
//     from: 'booking@bedbd.com',  // Sender address
//     to: toEmail,                   // Receiver address
//     subject: 'Your OTP Code',      // Subject line
//     text: `Your OTP code is ${otp}`, // Plain text body
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP email sent to ${toEmail},otp`);
//   } catch (error) {
//     console.error(`Error sending OTP email: ${error}`);
//     throw error;
//   }
// };

// module.exports = sendOTPEmail;
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter with Hostinger SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',   // Hostinger's SMTP server
  port: 587,                    // SMTP port
  secure: false,                 // Use TLS for security
  auth: {
    user: 'booking@bedbd.com',  // Your email address
    pass: process.env.passforG,  // The email account password (or app password if using 2-step verification)
  },
});

// Function to send OTP email
const sendOTPEmail = async (toEmail, otp) => {
  console.log(otp);
  const mailOptions = {
    from: 'booking@bedbd.com',  // Sender address
    to: toEmail,                // Receiver address
    subject: 'Your OTP Code',   // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending OTP email: ${error}`);
    throw error;
  }
};

module.exports = sendOTPEmail;
