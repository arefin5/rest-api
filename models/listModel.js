


const mongoose = require('mongoose');
const { Schema } = mongoose;
const safetySchema=require("./safetySchema")
const FavaritesSchema=require("./FavaritesSchema")
const AmenitiesSchema=require("./AmenitiesSchema")
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
    typeOfguests: {
      type: String,
      enum: ['An Entire Place', 'A Room', 'A Shared Room'], 
      default: 'An Entire Place'
    },
    location: {
      type: String
    },
    guest: {
      type: Number,
      default: 4,
    },
    bedRoom: {
      type: Number,
      default: 0,
    },
    beds: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },

    favorites:FavaritesSchema,
   
  
    safety: safetySchema,
    amenities:AmenitiesSchema,
    hoseTitle:{
      type:String,

    },
    describehouse:{
      type:String
    },
    description:{
      type:String
    },
    Postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },

    images: [
      {
        url: String,
        public_id: String,
      }
    ],
    status: {
      type: String,
      default: 'inactive'
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('List', listSchema);
