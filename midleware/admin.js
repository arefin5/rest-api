const User = require("../models/userModel");

const checkAdmin = async(req, res, next) => {
    console.log("user", req.auth);
  
    try {
      const userId = req.auth._id;
      const user = await User.findById(userId);
      console.log(user)
      if (user.role !== "admin") {
        return res.status(403).send("Permission denied: Admin access required");
      }
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { checkAdmin };
  