// amenities AmenitiesSchema.js


const mongoose = require('mongoose');
const { Schema } = mongoose;

const AmenitiesSchema = new Schema({
    pool: { type: Boolean, default: false },
    hottub: { type: Boolean, default: false },
    patio: { type: Boolean, default: false },
    bbqGrill: { type: Boolean, default: false },
    outdoorDiningArea: { type: Boolean, default: false },
    firePit: { type: Boolean, default: false },
    poolTable: { type: Boolean, default: false },
    indoorFirePlace: { type: Boolean, default: false },
    piano: { type: Boolean, default: false },
    exerciseEquipment: { type: Boolean, default: false },
    lakeAccess: { type: Boolean, default: false },
    beachAccess: { type: Boolean, default: false },
    ski: { type: Boolean, default: false },
    outdoorShower: { type: Boolean, default: false },

} ,{ _id: false });

module.exports = AmenitiesSchema;
