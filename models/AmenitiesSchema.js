const mongoose = require('mongoose');
const { Schema } = mongoose;

const  AmenitiesSchema= new Schema({
  outdoorScenicView: {
    type: Map,
    required:true,
    of: Boolean // Allows dynamic key-value pairs where values are Boolean
  },
  cookingCleaning: {
    type: Map,
    of: Boolean
  },
  internetOffice: {
    type: Map,
    of: Boolean
  },
  service: {
    type: Map,
    of: Boolean
  },
  notIncluded: {
    type: Map,
    of: Boolean
  },
  bathroom: {
    type: Map,
    of: Boolean
  },
  bedroomLaundry: {
    type: Map,
    of: Boolean
  },
  parkingFacilities: {
    type: Map,
    of: Boolean
  },
  general: {
    type: Map,
    of: Boolean
  }
},{ _id: false });

module.exports = AmenitiesSchema;
