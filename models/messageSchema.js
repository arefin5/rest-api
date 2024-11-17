const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    // message: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    message: {
  type: String,
  required: [true, 'Message content is required'],
  trim: true,
},
    isRead: {
      type: Boolean,
      default: false, // Track if the message has been read
    },
    isDelivered: {
      type: Boolean,
      default: false, // Track if the message has been delivered
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);
messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model('Message', messageSchema);
