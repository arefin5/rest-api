const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    fname:{
      type: String,
      trim: true,
    } ,
     lname:{
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
  cover: {
    url: String,
    public_id: String,
  },
  profilePic: {
    url: String,
    public_id: String,
  },
  varificationImage: {
    url: String,
    public_id: String,
  },
  varificationId : {
    url: String,
    public_id: String,
  },
  varificationIdType:{
    type:String,
    // required:true,
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
    about:{
      type:String,
    },
    isEmailVerified:{ type: Boolean, default: false},
    isPhoneVerified:{type:Boolean,default:false},
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: true } ,
    isOtpVerified:{ type: Boolean, default: false } ,
    role: {
      type: String,
    type: String,
    enum: [
      "user","host","admin"
    ],
    default: "user",
  },
  age:{
    type:Number
  },
  favoritelist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List", 
      default:[]
    },
  ],
    status:{
      type:String,
      default:"active"
    }

  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);