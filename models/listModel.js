
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const safetySchema=require("./safetySchema")
// const FavaritesSchema=require("./FavaritesSchema")
const AmenitiesSchema=require("./AmenitiesSchema");
// const Booking=require("./bookingSchema")
// const propertyFeatureSchema=require("./propertyFeatureSchema")
const totalBedSchema=require("./totalBedSchema")
const totalroomSchema=require("./totalroomSchema")
const availableDateSchema=require("./availableDateSchema")
const homeRuleSchema=require("./homeRuleSchema");
const GuestSchema=require("./GuestSchema")
// const bookingtype=require("./bookingtypeSchema")
const listSchema = new Schema(
  {
   typeOfproperty: {
  type: String,
  enum: [
"Villa",
"Farmhouse",
"Condons",
"Apartment", 
"House","Shard Room",
  ],
  default: 'House'
},
// propertyFeature: {
//     type: propertyFeatureSchema,
//     required: true
//   },
propertyFeature: [
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
], 
homeRule:[
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    
  },
],
bookingTypes:[
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
],
propertyCondition:{
  type:String,
  //  enum:["","semi-furnished","empty"],
   required:true
},
aprovingmethod:{
  required:true,
  type:String,
},

// booking type 
    typeOfguests: {
      type: String,
      enum: ['An Entire Place', 'A Room', 'A Shared Room'], 
      default: 'An Entire Place'
    },
// 
// bookingtype:bookingtype,
propertyTitle:{
  type:String,
  required:true,

},
description:{
  type:String
},

    // favorites:FavaritesSchema,
    //  safety: safetySchema,
    amenities:AmenitiesSchema,
    Guest:GuestSchema,
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },],
    totalroom:totalroomSchema,
    totalBed:totalBedSchema,
    availablecheck:availableDateSchema,
    // homerule:homeRuleSchema,
    

    gender:{
      type: String,
      enum: ['male', 'female', 'anyone'], 
      required:true
  },
// aprovingmethod:{
//   type: String,
//       enum: ['instant', 'manually',], 
//       required:true
// },

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
      type: {
        type: String, 
        enum: ['Point'], 
        // required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true
      },
      country:{
        type:String,
        // required:true
      },
      floor:{
        type:String,
      },
      streetAddress:{
        type:String,
        // required:true
      },
      address:{
        type:String,
        // required:true
      },
      addresstwo:{
        type:String,
      },
      thana:{
        type:String,
        required:true
      },
      district:{
        type:String,
        // required:true
      },
      postcode:{
        type:String,
        // required:true
      },
      googlemap:{
        type:String,
        // required:true
      },
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
