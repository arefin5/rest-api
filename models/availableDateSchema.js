// availableDateSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const availableDateSchema = new Schema({
    checkin:{
        type:String,
        enum: ['as soon as possible'], 
        required:true
    },
    startBookingDate:{
        type:String,
        required:true
    },
    thirtyPluseNight: { type: Boolean, default: false },
    maximumNight:{
        type:String,
        
    },
    stopGettingBook:{
     type: Boolean, default: false  
    },
    stopBookingDate:{
        type:String
    }
       
} ,{ _id: false });

module.exports = availableDateSchema;
