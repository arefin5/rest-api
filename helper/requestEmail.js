
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
const requestEmail = async (toEmail,subjectTest) => {
//   console.log(otp);
  const mailOptions = {
    from: 'booking@bedbd.com',  // Sender address
    to: toEmail,                // Receiver address
    subject: ' Booking Requested ',   // Subject line
    text: subjectTest
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`host  email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending OTP email: ${error}`);
    throw error;
  }
};

module.exports = requestEmail;
