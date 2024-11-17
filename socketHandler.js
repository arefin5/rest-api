
const dotenv = require('dotenv');
const Message = require('./models/messageSchema');
const Booking = require('./models/bookingSchema');
const jwt = require('jsonwebtoken');

dotenv.config();

const secret = process.env.JWT_SECRET;

// Main Socket.IO handler
// const socketUserMap = new Map(); // Store userId -> socket.id mapping
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Unread message count handler
    let unreadMessages = 0;

    // Function to update unread message count
    // function updateUnreadMessages(userId) {
    //   Message.countDocuments({ receiver: userId, isRead: false })

    //     .then((count) => {
    //       console.log(receiver)
    //       unreadMessages = count;
    //       io.to(userId).emit('unreadMessagesCount', unreadMessages);
    //     })
    //     .catch((error) => console.error('Error fetching unread messages:', error));
    // }
    function updateUnreadMessages(userId) {
      Message.countDocuments({ receiver: userId, isRead: false })
        .then((count) => {
          console.log(`Unread messages for user ${userId}: ${count}`);
          unreadMessages = count;
          io.to(userId).emit('unreadMessagesCount', unreadMessages);
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
        console.log(`User ${userId} joined the room`);

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
        console.log('User is not authenticated');
      }
    });

    // Fetch conversations for the user
    socket.on('getConversations', async (userId, callback) => {
      try {
        const conversations = await Message.aggregate([
          {
            $match: {
              $or: [{ sender: userId }, { receiver: userId }],
            },
          },
          {
            $group: {
              _id: { $cond: { if: { $eq: ['$sender', userId] }, then: '$receiver', else: '$sender' } },
              lastMessage: { $last: '$message' },
              timestamp: { $last: '$createdAt' },
            },
          },
          { $sort: { timestamp: -1 } },
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

    // Message read receipt handler
    socket.on('messageRead', async (messageId) => {
      if (!socket.user) return console.log('User is not authenticated');

      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.isRead = true;
          await message.save();

          // Emit read receipt to sender
          io.to(message.sender).emit('messageRead', messageId);

          // Update unread message count for the receiver
          updateUnreadMessages(message.receiver);
        }
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    // Check payment status
    socket.on('checkPaymentStatus', async (userId) => {
      if (!socket.user) return console.log('User is not authenticated');
      
      try {
        const bookings = await Booking.find({ Host: userId, status: 'paymentsuccess' });
        socket.emit('paymentSuccessBookings', bookings.length > 0 ? bookings : []);
      } catch (error) {
        console.error('Error checking payment status:', error);
        socket.emit('paymentSuccessBookings', []);
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
