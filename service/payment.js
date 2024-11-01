const uuid = require('uuid'); // To generate unique transaction IDs
const SSLCommerzPayment = require('sslcommerz-lts')

// Initialize the payment function
exports.initPayment = async (paymentData) => {
  const store_id = process.env.StoreID; // Your store ID
  const store_passwd = process.env.StorePassword; // Your store password
  const is_live = false; // Set to true if you're in the live environment
  // Initialize SSLCommerz payment instance
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  try {
    // Initiate the payment
    const apiResponse = await sslcz.init(paymentData);

    return apiResponse;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw new Error('Payment initialization failed');
  }
};
