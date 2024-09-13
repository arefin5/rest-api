const mongoose = require('mongoose');
const { Schema } = mongoose;
const safetySchema=require("./safetySchema")
const FavaritesSchema=require("./FavaritesSchema")
const AmenitiesSchema=require("./AmenitiesSchema");
const bookingSchema=require("./bookingSchema")
const propertyFeatureSchema=require("./propertyFeatureSchema")
const totalBedSchema=require("./totalBedSchema")
const totalroomSchema=require("./totalroomSchema")
const availableDateSchema=require("./availableDateSchema")
const homeRuleSchema=require("./homeRuleSchema")
const listSchema = new Schema(
  {
   typeOfproperty: {
  type: String,
  enum: [
    'House', 'Apartment', 'Barn', 'Bed & Breakfast', 'Boat', 'Cabin', 'Castle',
    'Camper/RV', 'Casa Particular', 'Cave', 'Container', 'Dammuso', 'Dome',
    'Cycladic Home', 'Earth Home', 'Tent', 'Tiny Home', 'Tower', 'Tree House',
    'Trullo', 'Yurt', 'Windmill'
  ],
  default: 'House'
},

propertyCondition:{
  type:String,
   enum:["full-furnished","semi-furnished","empty"],
   required:true
},
// booking type 
    typeOfguests: {
      type: String,
      enum: ['An Entire Place', 'A Room', 'A Shared Room'], 
      default: 'An Entire Place'
    },
// 
propertyTitle:{
  type:String,
  required:true,

},
description:{
  type:String
},
// 
// outdoorShower: { type: Boolean, default: false },

propertyFeature:propertyFeatureSchema,
    favorites:FavaritesSchema,
     safety: safetySchema,
    amenities:AmenitiesSchema,
    bookings: [bookingSchema], 
    totalroom:totalroomSchema,
    totalBed:totalBedSchema,
availablecheck:availableDateSchema,
homerule:homeRuleSchema,
    adults: {
      type: Number,
      default: 4,
    },
    under14:{
      type:Number
    },
    gender:{
      type: String,
      enum: ['male', 'female', 'anyone'], 
      required:true
  },
aprovingmethod:{
  type: String,
      enum: ['instant', 'manually',], 
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
tex:{
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
    Review: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    status: {
      type: String,
      default: 'inactive'
    },
    location: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
      country:{
        type:String,
        required:true
      },
      fllor:{
        type:String,
      },
      streetAddress:{
        type:String,
        required:true
      },
      address:{
        type:String,
        required:true
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
        required:true
      },
      postcode:{
        type:String,
        required:true
      },
      googlemap:{
        type:String,
        required:true
      },
    },

    bedge:{
      type:String,
      
    },
  },
 
  { timestamps: true }
);
listSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('List', listSchema);
