
const dotenv = require('dotenv');
const Message = require('./models/messageSchema');
const Booking = require('./models/bookingSchema');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

dotenv.config();

const secret = process.env.JWT_SECRET;

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // console.log('New client connected:', socket.id);

    // Unread message count handler
    let unreadMessages = 0;


    // function updateUnreadMessages(userId) {
    //   Message.countDocuments({ receiver: userId, isRead: false })
    //     .then((count) => {
    //       // console.log(`Unread messages for user ${userId}: ${count}`);
    //       unreadMessages = count;
    //       io.to(userId).emit('unreadMessagesCount', unreadMessages);
    //     })
    //     .catch((error) => console.error('Error fetching unread messages:', error));
    // }
    function updateUnreadMessages(userId) {
      if (!userId) return; // Ensure userId is valid before proceeding
    
      Message.countDocuments({ receiver: userId, isRead: false })
        .then((count) => {
          // Emit updated unread message count to the specific user's socket room
          io.to(userId).emit('unreadMessagesCount', count);
        })
        .catch((error) => console.error('Error fetching unread messages:', error));
    }
    
    // Authenticate user
    socket.on('authenticate', (token, callback) => {
      try {
        // Verify token using jsonwebtoken
        const decoded = jwt.verify(token, secret);
        socket.user = decoded; // Store user info on socket for later use

        // Send back the authenticated user object
        callback({ status: 'success', message: 'Authenticated successfully', user: decoded });
      } catch (err) {
        console.error('Authentication failed:', err);
        callback({ status: 'failed', message: 'Authentication failed' });
        socket.disconnect();
      }
    });

    // User joins their own room based on userId after authentication
    socket.on('join', (userId) => {
      if (socket.user) {
        socket.userId = userId;
        socket.join(userId);
        // console.log(`User ${userId} joined the room`);

        // Fetch and send undelivered messages
        Message.find({ receiver: userId, isDelivered: false })
          .then((messages) => {
            messages.forEach((message) => {
              socket.emit('receiveMessage', message);
              message.isDelivered = true;
              message.save();
            });
          })
          .catch((err) => console.error('Error fetching messages:', err));

        // Update unread message count for this user
        updateUnreadMessages(userId);
      } else {
        // console.log('User is not authenticated');
      }
    });
    socket.on('getConversations', async (userId, callback) => {
  try {
    // Validate and convert `userId` to an ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return callback({ status: 'failed', message: 'Invalid User ID' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate messages to find conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userObjectId },
            { receiver: userObjectId },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [{ $eq: ["$sender", userObjectId] }, "$receiver", "$sender"],
          },
          message: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $last: "$message" },
          timestamp: { $last: "$createdAt" },
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort conversations by latest message timestamp
      },
      {
        $lookup: {
          from: "users", // Collection name for user details
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          lastMessage: 1,
          timestamp: 1,
          userDetails: {
            fname: "$userDetails.fname", // Replace with actual fields in your User model
            email: "$userDetails.email",
          },
        },
      },
    ]);

    callback({ status: 'success', conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    callback({ status: 'failed', message: 'Error fetching conversations' });
  }
});
    // Send message handler
    socket.on('sendMessage', async ({ sender, receiver, message }, callback) => {
      if (!socket.user) return callback({ status: 'failed', message: 'User is not authenticated' });

      try {
        const newMessage = new Message({
          sender: sender,
          receiver: receiver,
          message,
          isDelivered: true,
          isRead: false,
        });
        await newMessage.save();

        // Emit the message to the receiver
        io.to(receiver).emit('receiveMessage', newMessage);

        // Update unread message count
        updateUnreadMessages(receiver);

        callback({ status: 'Message delivered' });
      } catch (error) {
        console.error('Error saving message:', error);
        callback({ status: 'Message delivery failed' });
      }
    });

    socket.on('getMessageHistory', async ({ userId, otherUserId }, callback) => {
      try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);
    
        // Mark messages as read
        await Message.updateMany(
          {
            $or: [
              { sender: userObjectId, receiver: otherUserObjectId },
              { sender: otherUserObjectId, receiver: userObjectId },
            ],
          },
          { $set: { isRead: true } }
        );
    
        // Fetch message history
        const messages = await Message.find({
          $or: [
            { sender: userObjectId, receiver: otherUserObjectId },
            { sender: otherUserObjectId, receiver: userObjectId },
          ],
        }).sort({ createdAt: 1 });
          // console.log(messages)
        callback({ status: 'success', messages });
      } catch (error) {
        console.error('Error fetching message history:', error);
        callback({ status: 'failed', message: 'Error fetching message history' });
      }
    });
    
    socket.on('messageRead', async (messageId) => {
      if (!socket.user) return console.log('User is not authenticated');

      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.isRead = true;
          await message.save();
          io.to(message.sender).emit('messageRead', messageId);
          updateUnreadMessages(message.receiver);
        }
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    socket.on('checkPaymentStatus', async (userId) => {
      if (!socket.user) return console.log('User is not authenticated');
      try {
        const bookings = await Booking.find({ Host: userId, status: 'pending' });
        socket.emit('paymentSuccessBookings', bookings.length > 0 ? bookings : []);
      } catch (error) {
        console.error('Error checking payment status:', error);
        socket.emit('paymentSuccessBookings', []);
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
