const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({

  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  guest:{
    type:Number,
  },
  Host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (Poster)
    required: true,
  },
  BClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (Poster)
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
  basePrice:{
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed',"paymentsuccess","hostApproved","cancel"],
    default: 'pending',
  },
  paymentClaim: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected',"paymentsuccess"],
    default: 'pending',
  },
  tran_id: {
    type: String,
  },
 
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
