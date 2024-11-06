const { verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel'); // Import your User model
const List=require("../models/listModel")
const { expressjwt: jwt } = require("express-jwt");

dotenv.config();
const JWT_SECRET=`SHDFAKSHDAOIW9438934JDHHSKDFJHIEW`

const secret = JWT_SECRET;

// Middleware to check the authorization token
const requireAuth = async (req, res, next) => {

};


const canEditDeletePost = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).send("Post not found");
    }

    if (req.auth._id != list.Postedby) {
      return res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
};
const isHost = async (req, res, next) => {
const user=await User.findById(req.auth._id)
  try {
    console.log(req.auth.role)
    if (user.role !== "host") {
      return res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
};
const requireSignin = jwt({
  secret: secret,
  algorithms: ['HS256'],
  getToken: (req) => req.headers.authorization?.split(' ')[1],
});


module.exports = { requireAuth ,canEditDeletePost,requireSignin,isHost};