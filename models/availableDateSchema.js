// availableDateSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const availableDateSchema = new Schema({
    checkInStart:{
        type:String,
        
        required:true
    },
    allowExtend:{
        type:String,
        required:true
    },
   
    bookingExtend:{
        type:String,
        required:true
    },
   
       
} ,{ _id: false });

module.exports = availableDateSchema;
