
const axios = require('axios');

const sendOtpSms = async (phone, otp) => {

  const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
  const SENDER_ID = '8809617618398';
  const message = `Bed Bd OTP is ${otp}`;
  const encodedMessage = encodeURIComponent(message);

  // Ensure phone number is formatted as +880XXXXXXXXX
  let formattedPhone = phone;
  if (!formattedPhone.startsWith('+88')) {
    formattedPhone = `+880${formattedPhone.replace(/^0+/, '')}`;
  }


  const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${formattedPhone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

  try {
    const response = await axios.get(apiUrl);

  
    if (response.data.response_code === 202) {
      return response.data.response_code;  // Return only response_code
    } else {
      console.error(`Failed to send OTP. Response: ${JSON.stringify(response.data)}`);
      return response.data.response_code;  // Return response_code for error handling
    }
  } catch (error) {
    console.error('Error sending OTP SMS:', error.message);
    throw new Error("Failed to send OTP SMS");
  }
};

module.exports = sendOtpSms;
