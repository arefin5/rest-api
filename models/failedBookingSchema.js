const mongoose = require('mongoose');

const failedBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tran_id: { type: String, required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  price: { type: Number, required: true },
  reason: { type: String, required: true }, // Reason for failure (e.g., payment failure)
  date: { type: Date, default: Date.now } // Date when the booking failed
});

module.exports = mongoose.model('FailedBooking', failedBookingSchema);
