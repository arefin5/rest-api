
const mongoose = require('mongoose');
const { Schema } = mongoose;
const safetySchema=require("./safetySchema")
const FavaritesSchema=require("./FavaritesSchema")
const propertyFeatureSchema=require("./propertyFeatureSchema")
const totalBedSchema=require("./totalBedSchema")
const totalroomSchema=require("./totalroomSchema")
const availableDateSchema=require("./availableDateSchema")
const homeRuleSchema=require("./homeRuleSchema");
const GuestSchema=require("./GuestSchema")
const bookingtype=require("./bookingtypeSchema")
const listSchema = new Schema(
  {
// booking type 
    typeOfguests: {
      type: String,
      enum: ['An Entire Place', 'A Room', 'A Shared Room'], 
      default: 'An Entire Place'
    },
// 

description:{
  type:String
},

   
    Guest:GuestSchema,
    // bookings: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Booking',
    //   required: true,
    // },],
    availablecheck:availableDateSchema,
    // homerule:homeRuleSchema,
    

    gender:{
      type: String,
      enum: ['male', 'female', 'anyone'], 
      required:true
  },


price : {
  type:Number,
  required:true
},

serviceFee:{
  type:Number,
  required:true
},
tax:{
  type:Number,
  required:true
},
      
GroundPrice:{
  type:Number,
  required:true
},
images: [
  {
    url: String,
    public_id: String,
  }
],
    Postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

    status: {
      type: String,
      enum: ['draft', 'published','active'], 
      default: 'draft', 
    },
    location: {
      
     
     
    },
checkInTime:{
  type:String,
  required:true
},
      checkOutTime:{
        type:String,
        required:true,
      },
    bedge:{
      type:String,
      
    },
  },
 
  { timestamps: true }
);
listSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('List', listSchema);
