// Dependencies
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

// ENV variables
require('dotenv').config();

// Passport
const passport = require('./helpers/passport');
const { checkAuth, errorHandler } = require('./helpers/utils');

// Routes
const authRoutes = require('./routes/auth');

// App
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL, {
  useMongoClient: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});
mongoose.connection.on('error', (err) => {
  throw new Error(err);
});

// Setup Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// API Endpoint
app.get('/api', (req, res) => {
  if (req.user) res.json(req.user);
  res.status(200).json({ msg: 'API Endpoint' });
});

// Authenticated route
app.get('/protected', checkAuth, (req, res) => {
  console.log(req.user);
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
