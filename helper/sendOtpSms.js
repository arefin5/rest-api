
// // // const axios = require('axios');



// // // const sendOtpSms = async (phone, otp) => {
// // //   console.log("test statart............")
// // //   const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
// // // const SENDER_ID = '8809617618398';
// // //   const message = `Bed Bd  OTP is ${otp}`;
// // //   const encodedMessage = encodeURIComponent(message);
// // //   console.log(phone)
// // //   const numbers=await `+phone`
// // //   console.log(numbers)

// // //   const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${phone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

// // //   try {
// // //     const response = await axios.get(apiUrl);
// // //     console.log(response)
// // //     return response.data;
// // //   } catch (error) {
// // //     console.error(`Error sending OTP SMS: ${error.message}`);
// // //     throw new Error("Failed to send OTP SMS");
// // //   }
// // // };

// // // module.exports = sendOtpSms;
// // const axios = require('axios');

// // const sendOtpSms = async (phone, otp) => {
// //   console.log("Starting SMS send...");

// //   const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
// //   const SENDER_ID = '8809617618398';
// //   const message = `Bed Bd OTP is ${otp}`;
// //   const encodedMessage = encodeURIComponent(message);

// //   // Ensure phone number is correctly formatted with +88 prefix
// //   const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone.replace(/^0+/, '')}`;

// //   console.log(`Formatted phone number: ${formattedPhone}`);

// //   const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${formattedPhone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

// //   try {
// //     const response = await axios.get(apiUrl);
// //     // console.log(response.data); // Print only response data
// //     return response.data;
// //   } catch (error) {
// //     console.error(`Error sending OTP SMS: ${error.message}`);
// //     throw new Error("Failed to send OTP SMS");
// //   }
// // };

// // module.exports = sendOtpSms;
// const axios = require('axios');

// const sendOtpSms = async (phone, otp) => {
//   console.log("Starting SMS send...");

//   const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
//   const SENDER_ID = '8809617618398';
//   const message = `Bed Bd OTP is ${otp}`;
//   const encodedMessage = encodeURIComponent(message);

//   // Ensure phone number is formatted as +880XXXXXXXXX
//   let formattedPhone = phone;
//   if (!formattedPhone.startsWith('+88')) {
//     formattedPhone = `+880${formattedPhone.replace(/^0+/, '')}`;
//   }

//   console.log(`Formatted phone number: ${formattedPhone}`);

//   const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${formattedPhone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

//   try {
//     const response = await axios.get(apiUrl);

//     // Log the entire response object for debugging
//     console.log('API Response:', response.data);

//     return response.data;
//   } catch (error) {
//     // Capture detailed error info
//     if (error.response) {
//       console.error('Error Response Data:', error.response.data);
//       console.error('Error Status Code:', error.response.status);
//     } else if (error.request) {
//       console.error('No response received:', error.request);
//     } else {
//       console.error('Error in setting up request:', error.message);
//     }
//     throw new Error("Failed to send OTP SMS");
//   }
// };

// module.exports = sendOtpSms;
// const axios = require('axios');

// const sendOtpSms = async (phone, otp) => {
//   console.log("Starting SMS send...");

//   const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
//   const SENDER_ID = '8809617618398';
//   const message = `Bed Bd OTP is ${otp}`;
//   const encodedMessage = encodeURIComponent(message);

//   // Ensure phone number is formatted as +880XXXXXXXXX
//   let formattedPhone = phone;
//   if (!formattedPhone.startsWith('+88')) {
//     formattedPhone = `+880${formattedPhone.replace(/^0+/, '')}`;
//   }

//   console.log(`Formatted phone number: ${formattedPhone}`);

//   const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${formattedPhone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

//   try {
//     const response = await axios.get(apiUrl);

//     // Log the full response for debugging
//     console.log('API Response:', response.data);

//     // Check the response code explicitly
//     if (response.data.response_code === 202) {
//       console.log(`OTP sent successfully to ${phone}.`);
//       return response.data;
//     } else {
//       // Log error message if response code is not 202
//       console.error(`Failed to send OTP to ${phone}. API Response Code: ${response.data.response_code}, Message: ${response.data.error_message || 'Unknown error'}`);
//       throw new Error("Failed to send OTP SMS");
//     }
//   } catch (error) {
//     // Detailed error handling
//     if (error.response) {
//       console.error('Error Response Data:', error.response.data);
//       console.error('Error Status Code:', error.response.status);
//     } else if (error.request) {
//       console.error('No response received:', error.request);
//     } else {
//       console.error('Error in setting up request:', error.message);
//     }
//     throw new Error("Failed to send OTP SMS");
//   }
// };

// module.exports = sendOtpSms;
const axios = require('axios');

const sendOtpSms = async (phone, otp) => {
  console.log("Starting SMS send...");

  const SMS_API_KEY = 'eIRUl6dShD7VJ0sZ1q1f';
  const SENDER_ID = '8809617618398';
  const message = `Bed Bd OTP is ${otp}`;
  const encodedMessage = encodeURIComponent(message);

  // Ensure phone number is formatted as +880XXXXXXXXX
  let formattedPhone = phone;
  if (!formattedPhone.startsWith('+88')) {
    formattedPhone = `+880${formattedPhone.replace(/^0+/, '')}`;
  }

  // console.log(`Formatted phone number: ${formattedPhone}`);

  const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${SMS_API_KEY}&type=text&number=${formattedPhone}&senderid=${SENDER_ID}&message=${encodedMessage}`;

  try {
    const response = await axios.get(apiUrl);

    // Log the full response for debugging
    // console.log('API Response:', response.data);

    // Check the response code explicitly
    if (response.data.response_code === 202) {
      // console.log(`OTP sent successfully to ${phone}.`);
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
