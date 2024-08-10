require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

// MongoDB connection URI
const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const db = mongoose.connection;

module.exports = db;
