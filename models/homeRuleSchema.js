// homeRuleSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const homeRuleSchema = new Schema({
    pets: { type: Boolean, default: false } ,
    evenorPartys: { type: Boolean, default: false },
    checkinTimes: { type: String,},
    checkouttimes: { type: String,  },

}, { _id: false,strict: false });


module.exports = homeRuleSchema;
