const { verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel'); // Import your User model
const List=require("../models/listModel")
const { expressjwt: jwt } = require("express-jwt");

dotenv.config();

const secret = process.env.JWT_SECRET;

// Middleware to check the authorization token
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decoded = verify(token.split(' ')[1], secret);
    // Fetch the complete user data from the database
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // Attach the user data to the request
    req.user = user;
    // console.log(user)
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

const requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
// const canEditDeletePost = async (req, res, next) => {
//   try {
//     const list = await List.findById(req.params._id);
//      console.log(req.auth)
//     if (req.auth._id != list.Postedby) {
//       return res.status(400).send("Unauthorized");
//     } else {
//       next();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
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

module.exports = { requireAuth ,canEditDeletePost,requireSignin};