// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const messageSchema = new Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to the User model
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to the User model
//       required: true,
//     },
//     message: {
//   type: String,
//   required: [true, 'Message content is required'],
//   trim: true,
// },
//     isRead: {
//       type: Boolean,
//       default: false, // Track if the message has been read
//     },
//     isDelivered: {
//       type: Boolean,
//       default: false, // Track if the message has been delivered
//     },
//   },
//   { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
// );
// messageSchema.index({ sender: 1, receiver: 1 });

// module.exports = mongoose.model('Message', messageSchema);
const mongoose = require('mongoose');
const moment = require('moment-timezone');
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

// Virtual field to convert timestamps to Bangladesh timezone (UTC+6)
messageSchema.virtual('createdAtLocal').get(function () {
  return moment(this.createdAt).tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss');
});

messageSchema.virtual('updatedAtLocal').get(function () {
  return moment(this.updatedAt).tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss');
});

// Ensure virtual fields are included in the output
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

// Create an index for better query performance
messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model('Message', messageSchema);
