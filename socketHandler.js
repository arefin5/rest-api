// socketHandler.js

const Message = require('./models/messageSchema'); // Import your Message model

// Initialize Socket.IO logic
const socketHandler = (io) => {
  // Handle client connections
  io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);

    // Assuming `userId` is passed directly from the frontend during connection (based on your existing user model)
    socket.on('join', (userId) => {
      socket.userId = userId;
      socket.join(userId); // User joins a room with their userId
      console.log(`User ${userId} joined the room`);

      // Fetch and send undelivered messages to the user
      Message.find({ receiver: userId, isDelivered: false })
        .then(messages => {
          messages.forEach(message => {
            socket.emit('receiveMessage', message);
            message.isDelivered = true;
            message.save();
          });
        })
        .catch(err => console.error('Error fetching messages:', err));
    });

    // Listen for new messages
    socket.on('sendMessage', async ({ senderId, receiverId, message }, callback) => {
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

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);
    });
  });
};

module.exports = socketHandler;
