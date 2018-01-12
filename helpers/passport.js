// Dependencies
const passport = require('passport');
const TrelloStrategy = require('passport-trello').Strategy;

// User model
const User = require('../models/user');

// ENV variables
require('dotenv').config();

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
}, (req, token, secret, profile, cb) => {
  cb(null, { profile, token });
}));

passport.serializeUser((user, cb) => {
  User.findOrCreate({
    id: user.profile.id,
    token: user.token,
  }, (err, doc) => {
    console.log(doc);
    cb(err, { id: doc._id });
  });
});

passport.deserializeUser((obj, cb) => cb(null, obj));

module.exports = passport;
