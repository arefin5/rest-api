const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each property feature (name-value pair)
const featureSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const propertyFeatureSchema = new Schema({
  features: {
    type: Map,
    of: featureSchema
  }
}, { _id: false });

module.exports = propertyFeatureSchema;
