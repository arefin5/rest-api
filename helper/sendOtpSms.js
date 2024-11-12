// const axios = require('axios');

// // Set your API key and sender ID

// // id:mdalmamun
// // pass: AS2SQBBN
// // Cr85EGZ5kSEDbGKhpzSJ
// // Send OTP function
// async function sendOtp(req, res) {
//      const apiKey = 'Cr85EGZ5kSEDbGKhpzSJ';
//      const senderId = '8809617618398';
//     // Extract OTP and recipient number from the request
//     const { otp, number } = req.body;

//     if (!otp || !number) {
//         return res.status(400).json({ error: 'OTP and number are required.' });
//     }

//     // Construct the message with OTP
//     const message = `Your CompanyName OTP is ${otp}`;
//     const encodedMessage = encodeURIComponent(message); // Encode message for URL

//     // Construct the API URL
//     const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${number}&senderid=${senderId}&message=${encodedMessage}`;

//     try {
//         // Send the OTP via SMS API
//         const response = await axios.get(apiUrl);

//         // Handle different response codes from the API
//         const responseCode = response.data;
//         let message;

//         switch (responseCode) {
//             case '202':
//                 message = 'SMS Submitted Successfully';
//                 res.status(200).json({ success: true, message });
//                 break;
//             case '1001':
//                 message = 'Invalid Number';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1002':
//                 message = 'Sender ID not correct or is disabled';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1003':
//                 message = 'All fields required / Contact Administrator';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1007':
//                 message = 'Balance Insufficient';
//                 res.status(400).json({ success: false, message });
//                 break;
//             default:
//                 message = 'An unknown error occurred';
//                 res.status(500).json({ success: false, message });
//                 break;
//         }
//     } catch (error) {
//         console.error('Error sending SMS:', error);
//         res.status(500).json({ success: false, message: 'Failed to send SMS' });
//     }
// }

// module.exports = sendOtp;
// const axios = require('axios');

// // Set your API key and sender ID
// const apiKey = 'eIRUl6dShD7VJ0sZ1q1f';
// const senderId = '8809617618398';

// // Send OTP function
// async function sendOtp(req, res) {
//     // Extract OTP and recipient number from the request
//     const { otp, number } = req.body;

//     if (!otp || !number) {
//         return res.status(400).json({ error: 'OTP and number are required.' });
//     }

//     // Construct the message with OTP
//     const message = `Your CompanyName OTP is ${otp}`;
//     const encodedMessage = encodeURIComponent(message); // Encode message for URL

//     // Construct the API URL
//     const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${number}&senderid=${senderId}&message=${encodedMessage}`;

//     try {
//         // Send the OTP via SMS API
//         const response = await axios.get(apiUrl);

//         // Handle different response codes from the API
//         const responseCode = response.data;
//         let message;

//         switch (responseCode) {
//             case '202':
//                 message = 'SMS Submitted Successfully';
//                 res.status(200).json({ success: true, message });
//                 break;
//             case '1001':
//                 message = 'Invalid Number';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1002':
//                 message = 'Sender ID not correct or is disabled';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1003':
//                 message = 'All fields required / Contact Administrator';
//                 res.status(400).json({ success: false, message });
//                 break;
//             case '1007':
//                 message = 'Balance Insufficient';
//                 res.status(400).json({ success: false, message });
//                 break;
//             default:
//                 message = 'An unknown error occurred';
//                 res.status(500).json({ success: false, message });
//                 break;
//         }
//     } catch (error) {
//         console.error('Error sending SMS:', error);
//         res.status(500).json({ success: false, message: 'Failed to send SMS' });
//     }
// }

// module.exports = sendOtp;
const axios = require('axios');



const sendOtpSms = async (phone, otp) => {
  const SMS_API_KEY = 'qeZjQsThGc859sUCh3jw';
const SENDER_ID = '8809617618398';
  const message = `Bed Bd  OTP is ${otp}`;
  const encodedMessage = encodeURIComponent(message);
  const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${phone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data; // Returns the response code
  } catch (error) {
    console.error(`Error sending OTP SMS: ${error.message}`);
    throw new Error("Failed to send OTP SMS");
  }
};

module.exports = sendOtpSms;
