// Dependencies
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const TrelloStrategy = require('passport-trello').Strategy;
const session = require('express-session');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

// ENV variables
require('dotenv').config();

// App
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport
passport.use(new TrelloStrategy({
  consumerKey: process.env.TRELLO_CONSUMER_KEY,
  consumerSecret: process.env.TRELLO_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000/auth/trello/callback',
  passReqToCallback: true,
  trelloParams: {
    scope: 'read,write',
    name: 'Pomodoro App',
    expiration: 'never',
  },
}, (req, token, secret, profile, cb) => cb(null, profile)));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.use(passport.initialize());
app.use(passport.session());

// Authentication check function
const authenticate = expressJwt({
  secret: 'server-secret',
});

// Generate JWT token
const generateToken = (req, res, next) => {
  req.token = jwt.sign({
    id: req.user.id,
  }, 'server-secret', {
    expiresIn: '10h',
  });

  next();
};

// Error handler
const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  }

  next();
};

// Passport routes
app.get('/auth/trello', passport.authenticate('trello'));

app.get('/auth/trello/callback', passport.authenticate('trello', {
  failureRedirect: '/api',
}), generateToken, (req, res) => {
  res.render('success', { token: JSON.stringify(req.token) });
});

// API Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ msg: 'API Endpoint' });
});

// Authenticated route
app.get('/protected', authenticate, (req, res) => {
  res.json({ msg: 'Logged in' });
});

// Serve static frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle UnauthorizedError thrown by express-jwt
app.use(errorHandler);

// Start app on port 3000
app.listen(3000, () => {
  console.log('App started');
});
