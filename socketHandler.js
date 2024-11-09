// // // socketHandler.js

// // const Message = require('./models/messageSchema'); // Import your Message model

// // // Initialize Socket.IO logic
// // const socketHandler = (io) => {
// //   // Handle client connections
// //   io.on('connection', (socket) => {
// //     console.log('New client connected: ', socket.id);

// //     // Assuming `userId` is passed directly from the frontend during connection (based on your existing user model)
// //     socket.on('join', (userId) => {
// //       socket.userId = userId;
// //       socket.join(userId); // User joins a room with their userId
// //       console.log(`User ${userId} joined the room`);

// //       // Fetch and send undelivered messages to the user
// //       Message.find({ receiver: userId, isDelivered: false })
// //         .then(messages => {
// //           messages.forEach(message => {
// //             socket.emit('receiveMessage', message);
// //             message.isDelivered = true;
// //             message.save();
// //           });
// //         })
// //         .catch(err => console.error('Error fetching messages:', err));
// //     });

// //     // Listen for new messages
// //     socket.on('sendMessage', async ({ senderId, receiverId, message }, callback) => {
// //       try {
// //         // Save the message in MongoDB
// //         const newMessage = new Message({
// //           sender: senderId,
// //           receiver: receiverId,
// //           message,
// //           isDelivered: false,
// //           isRead: false,
// //         });
// //         await newMessage.save();

// //         // Emit the message to the receiver in real-time
// //         io.to(receiverId).emit('receiveMessage', newMessage);

// //         // Notify sender about message delivery
// //         callback({ status: 'Message delivered' });
// //       } catch (error) {
// //         console.error('Error saving message:', error);
// //         callback({ status: 'Message delivery failed' });
// //       }
// //     });

// //     // Handle message read receipts
// //     socket.on('messageRead', async (messageId) => {
// //       try {
// //         const message = await Message.findById(messageId);
// //         if (message) {
// //           message.isRead = true;
// //           await message.save();

// //           // Notify the sender that the message was read
// //           io.to(message.sender).emit('messageRead', messageId);
// //         }
// //       } catch (error) {
// //         console.error('Error updating message status:', error);
// //       }
// //     });

// //     // Handle disconnections
// //     socket.on('disconnect', () => {
// //       console.log('Client disconnected: ', socket.id);
// //     });
// //   });
// // };

// // module.exports = socketHandler;
// const jwt = require('jsonwebtoken');
// const Message = require('./models/messageSchema');
// const Booking = require('./models/bookingSchema');  // Assuming Booking model is used for payments
// const { requireSignin } = require('./midleware/auth');  // Assuming requireSignin is your middleware

// // Initialize Socket.IO logic
// const socketHandler = (io) => {
//   // Handle client connections
//   io.on('connection', (socket) => {
//     console.log('New client connected: ', socket.id);

//     // Authenticate user on connection
//     socket.on('authenticate', (token, callback) => {
//       // Validate the token using JWT or any other strategy
//       requireSignin(token, (err, user) => {
//         if (err) {
//           console.error('Authentication failed:', err);
//           callback({ status: 'failed', message: 'Authentication failed' });
//           socket.disconnect();  // Disconnect if authentication fails
//         } else {
//           socket.user = user;  // Attach the authenticated user to the socket
//           callback({ status: 'success', message: 'Authenticated successfully' });
//         }
//       });
//     });

//     // Proceed with other events after authentication
//     socket.on('join', (userId) => {
//       if (socket.user) {
//         socket.userId = userId;
//         socket.join(userId);  // User joins a room with their userId
//         console.log(`User ${userId} joined the room`);
//       } else {
//         console.log('User is not authenticated');
//       }
//     });

//     // Handle sending a new message
//     socket.on('sendMessage', async ({ senderId, receiverId, message }, callback) => {
//       if (!socket.user) {
//         return callback({ status: 'failed', message: 'User is not authenticated' });
//       }

//       try {
//         // Save the message in MongoDB
//         const newMessage = new Message({
//           sender: senderId,
//           receiver: receiverId,
//           message,
//           isDelivered: false,
//           isRead: false,
//         });
//         await newMessage.save();

//         // Emit the message to the receiver in real-time
//         io.to(receiverId).emit('receiveMessage', newMessage);

//         // Notify sender about message delivery
//         callback({ status: 'Message delivered' });
//       } catch (error) {
//         console.error('Error saving message:', error);
//         callback({ status: 'Message delivery failed' });
//       }
//     });

//     // Handle message read receipts
//     socket.on('messageRead', async (messageId) => {
//       if (!socket.user) {
//         return console.log('User is not authenticated');
//       }

//       try {
//         const message = await Message.findById(messageId);
//         if (message) {
//           message.isRead = true;
//           await message.save();

//           // Notify the sender that the message was read
//           io.to(message.sender).emit('messageRead', messageId);
//         }
//       } catch (error) {
//         console.error('Error updating message status:', error);
//       }
//     });

//     // Real-time booking status check (for 'paymentsuccess')
//     socket.on('checkPaymentStatus', async (userId) => {
//       if (!socket.user) {
//         return console.log('User is not authenticated');
//       }

//       try {
//         // Check if there are any bookings with 'paymentsuccess' status for the user
//         const bookings = await Booking.find({ user: userId, status: 'paymentsuccess' });
        
//         // Emit the bookings to the user in real-time
//         if (bookings.length > 0) {
//           socket.emit('paymentSuccessBookings', bookings);
//         } else {
//           socket.emit('paymentSuccessBookings', []);
//         }
//       } catch (error) {
//         console.error('Error checking payment status:', error);
//         socket.emit('paymentSuccessBookings', []);
//       }
//     });

//     // Handle disconnections
//     socket.on('disconnect', () => {
//       console.log('Client disconnected: ', socket.id);
//     });
//   });
// };

// module.exports = socketHandler;
const Message = require('./models/messageSchema');
const Booking = require('./models/bookingSchema');  // Assuming Booking model is used for payments
const { requireSignin } = require('./midleware/auth');  // Assuming requireSignin is your middleware

// Initialize Socket.IO logic
const socketHandler = (io) => {
  // Handle client connections
  io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);

    // Authenticate user on connection
    socket.on('authenticate', (token, callback) => {
      // Validate the token using JWT or any other strategy
      requireSignin(token, (err, user) => {
        if (err) {
          console.error('Authentication failed:', err);
          callback({ status: 'failed', message: 'Authentication failed' });
          socket.disconnect();  // Disconnect if authentication fails
        } else {
          socket.user = user;  // Attach the authenticated user to the socket
          callback({ status: 'success', message: 'Authenticated successfully' });
        }
      });
    });

    // Proceed with other events after authentication
    socket.on('join', (userId) => {
      if (socket.user) {
        socket.userId = userId;
        socket.join(userId);  // User joins a room with their userId
        console.log(`User ${userId} joined the room`);
      } else {
        console.log('User is not authenticated');
      }
    });

    // Handle sending a new message
    socket.on('sendMessage', async ({ senderId, receiverId, message }, callback) => {
      if (!socket.user) {
        return callback({ status: 'failed', message: 'User is not authenticated' });
      }

      try {
        // Save the message in MongoDB
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          message,
          isDelivered: false,
          isRead: false,
        });
        await newMessage.save();

        // Emit the message to the receiver in real-time
        io.to(receiverId).emit('receiveMessage', newMessage);

        // Notify sender about message delivery
        callback({ status: 'Message delivered' });
      } catch (error) {
        console.error('Error saving message:', error);
        callback({ status: 'Message delivery failed' });
      }
    });

    // Handle message read receipts
    socket.on('messageRead', async (messageId) => {
      if (!socket.user) {
        return console.log('User is not authenticated');
      }

      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.isRead = true;
          await message.save();

          // Notify the sender that the message was read
          io.to(message.sender).emit('messageRead', messageId);
        }
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    // Real-time booking status check (for 'paymentsuccess')
    socket.on('checkPaymentStatus', async (userId) => {
      if (!socket.user) {
        return console.log('User is not authenticated');
      }

      try {
        // Check if there are any bookings with 'paymentsuccess' status for the user
        const bookings = await Booking.find({ Host: userId, status: 'paymentsuccess' });
        
        // Emit the bookings to the user in real-time
        if (bookings.length > 0) {
          socket.emit('paymentSuccessBookings', bookings);
        } else {
          socket.emit('paymentSuccessBookings', []);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        socket.emit('paymentSuccessBookings', []);
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);
    });
  });
};

module.exports = socketHandler;
