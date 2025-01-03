


const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each property feature (name-value pair)
const homesRoulesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  }
}, { _id: false });

const homeRuleSchema = new Schema({
  homesRoules: {
    type: Map,
    of: homesRoulesSchema,
  }

}, { _id: false });

module.exports = homeRuleSchema;
