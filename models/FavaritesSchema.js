const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavaritesSchema = new Schema({
    wifi: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    washer: { type: Boolean, default: false },
    freeParking: { type: Boolean, default: false },
    paidParking: { type: Boolean, default: false },
    airCondition: { type: Boolean, default: false },
    dedicatedWorkSpace: { type: Boolean, default: false },


});

module.exports = FavaritesSchema;
