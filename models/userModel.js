const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      min: 6,
      max: 64,
    },
    phone: {
      type: String,
    },
    image: {
    url: String,
    public_id: String,
  },
  ProfilePic: {
    url: String,
    public_id: String,
  },
   
    birth:{
      type:String,
    },
    fatherName:{
        type:String,
    },
    idNumber:{
        type:String,
    },
    motherName:{
      type:String
    },
    presentAddress:{
      type:String
    },
    parmanentAddress:{
      type:String,
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false } ,
    isOtpVerified:{ type: Boolean, default: false } ,
    role: {
      type: String,
      default: "host",
    },
    status:{
      type:String,
      default:"inactive"
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);
