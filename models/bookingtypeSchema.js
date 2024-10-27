
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each property feature (name-value pair)
const bookingTypes = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  }
}, { _id: false });

const BookingTypeSchema = new Schema({
  bookingTypes: {
    type: Map,
    of: bookingTypes,
  }

}, { _id: false });

module.exports = BookingTypeSchema;
