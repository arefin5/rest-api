

const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertyFeatureSchema = new Schema({
   
    exclusive: { type: Boolean, default: false },
    nature: { type: Boolean, default: false },
    hill:{ type: Boolean, default: false },
    seaBeatch: { type: Boolean, default: false },
    lakeView: { type: Boolean, default: false },
    Home: { type: Boolean, default: false },
    room: { type: Boolean, default: false },
    cottage: { type: Boolean, default: false },

} ,{ _id: false });

module.exports = propertyFeatureSchema;
