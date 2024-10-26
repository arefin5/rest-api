// amenities totalroomSchema.js


const mongoose = require('mongoose');
const { Schema } = mongoose;

const totalBedSchema = new Schema({
    singleBed: {
        type: Number,
        default: 0,
       
      },
    //   beds: { type: Number, default: 0 },
  doubleBed: {
        type: Number,
        default: 0,
      },
      extrabed: {
        type: Number,
        default: 0,
      },
     
      
} ,{ _id: false,strict: false  });

module.exports = totalBedSchema;
