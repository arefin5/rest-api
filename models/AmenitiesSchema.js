// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const  AmenitiesSchema= new Schema({
//   outdoorScenicView: {
//     type: Map,
//     required:true,
//     of: Boolean // Allows dynamic key-value pairs where values are Boolean
//   },
//   cookingCleaning: {
//     type: Map,
//     of: Boolean
//   },
//   internetOffice: {
//     type: Map,
//     of: Boolean
//   },
//   service: {
//     type: Map,
//     of: Boolean
//   },
//   notIncluded: {
//     type: Map,
//     of: Boolean
//   },
//   bathroom: {
//     type: Map,
//     of: Boolean
//   },
//   bedroomLaundry: {
//     type: Map,
//     of: Boolean
//   },
//   parkingFacilities: {
//     type: Map,
//     of: Boolean
//   },
//   general: {
//     type: Map,
//     of: Boolean
//   }
// },{ _id: false });

// module.exports = AmenitiesSchema;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AmenitiesSchema = new Schema({
  outdoorScenicView: { 
    type: Map, 
    of: Boolean, 
    default: {
      lakeAccess: false,
      beachAccess: false,
      ski: false
    } // predefined keys with default values
  },
  cookingCleaning: { 
    type: Map, 
    of: Boolean, 
    default: {
      kitchen: false,
      bbqGrill: false,
      outdoorDiningArea: false
    }
  },
  internetOffice: { 
    type: Map, 
    of: Boolean, 
    default: {
      wifi: false,
      dedicatedWorkSpace: false
    }
  },
  service: { 
    type: Map, 
    of: Boolean, 
    default: {
      airCondition: false
    }
  },
  notIncluded: { 
    type: Map, 
    of: Boolean, 
    default: {
      hotTub: false
    }
  },
  bathroom: { 
    type: Map, 
    of: Boolean, 
    default: {
      outdoorShower: false
    }
  },
  bedroomLaundry: { 
    type: Map, 
    of: Boolean, 
    default: {
      washer: false
    }
  },
  parkingFacilities: { 
    type: Map, 
    of: Boolean, 
    default: {
      freeParking: false,
      paidParking: false
    }
  },
  general: { 
    type: Map, 
    of: Boolean, 
    default: {
      pool: false,
      hottub: false,
      patio: false,
      firePit: false,
      poolTable: false,
      indoorFirePlace: false,
      piano: false,
      exerciseEquipment: false
    }
  }
}, { _id: false });
