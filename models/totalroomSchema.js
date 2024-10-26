// amenities totalroomSchema.js


const mongoose = require('mongoose');
const { Schema } = mongoose;

const totalroomSchema = new Schema({


  


    bedRoom: {
        type: Number,
        default: 0,
        required:true
      },
    //   beds: { type: Number, default: 0 },
  diningRoom: {
        type: Number,
        default: 0,
      },
      washRoom: {
        type: Number,
        default: 0,
      },
      others:{
        type: Number,
        default: 0,
      },
   
} ,{ _id: false,strict: false  });

module.exports = totalroomSchema;
