const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');

// In-memory blacklist for tokens (replace with a persistent store in production)
const tokenBlacklist = new Set();

// Logout route
router.post('/logout', requireSignin, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Add the token to the blacklist
  tokenBlacklist.add(token);

  res.json({ message: "Logged out successfully" });
});

// Middleware to check token blacklist
const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token has been invalidated, please log in again." });
  }

  next();
};

// Example of a protected route
router.get('/protected-route', requireSignin, checkBlacklist, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
