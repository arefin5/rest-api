const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequestDataModel = new Schema({

  
  BClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (Poster)
    required: true,
  },
  email: {
    type: Number,
    required: true,
  },
  resident:{
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', "cancel"],
    default: 'pending',
  },
 
}, { timestamps: true });

module.exports = mongoose.model('RequestDataModel', RequestDataModel);
