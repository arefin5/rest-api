const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List', // Reference to the property (List model)
    required: true,
  },
  checkinDate: {
    type: Date,
    required: true,
  },
  checkoutDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  },
  tran_id: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
