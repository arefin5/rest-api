const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkinDate: {
    type: Date,
    required: true,
    unique:true,
  },
  checkoutDate: {
    type: Date,
    required: true,
    unique:true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = bookingSchema;
