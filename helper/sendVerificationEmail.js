const nodemailer = require('nodemailer');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'arefintalukder5@gmail.com',
    pass: 'nzvpycdcyoblvagq',  // App-specific password for Gmail
  },
});

// Function to send the verification email
const sendVerificationEmail = async (toEmail, verificationLink) => {
  const mailOptions = {
    from: 'arefintalukder5@gmail.com',  // Sender address
    to: toEmail,                        // Receiver address
    subject: 'Verify Your Email',       // Subject line
    text: `Click the following link to verify your email: ${verificationLink}`, // Plain text body
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>` // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
    throw error;
  }
};

module.exports = sendVerificationEmail;
