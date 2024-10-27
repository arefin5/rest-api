
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GuestSchema = new Schema({

adults: {
      type: Number,
      default: 4,
    },
    under14:{
      type:Number
    },

   
} ,{ _id: false,strict: false  });

module.exports = GuestSchema;
