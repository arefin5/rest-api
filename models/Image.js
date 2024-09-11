const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
      type: String,
      required: true,
  },
  public_id: {
      type: String,
      required: true,
      unique: true,
  },
  categories: {
    type: String,
    enum: ['nid', 'passport', 'Drivinglicense'],  // Add your valid categories here
    default: 'nid'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },

}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
