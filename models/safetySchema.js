// models/Safety.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const safetySchema = new Schema({
   smokeAlarm: { type: Boolean, default: false } ,
    fireExtingguisher: { type: Boolean, default: false },
    firstAidKit: { type: Boolean, default: false  },
    carbonMonoxidealarm: { type: Boolean, default: false  },

}, { _id: false });


module.exports = safetySchema;
