// Dependencies
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

// ENV variables
require('dotenv').config();

// Authentication check function
exports.checkAuth = expressJwt({
  secret: process.env.JWT_SECRET,
});

// Generate JWT token
exports.generateToken = (req, res, next) => {
  req.token = jwt.sign({
    id: req.user.id,
  }, process.env.JWT_SECRET, {
    expiresIn: '10h',
  });

  next();
};

// Error handler
exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  }

  next();
};
