// Dependencies
const passport = require('passport');
const TrelloStrategy = require('passport-trello').Strategy;

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
  cb(null, { id: user.profile.id, token: user.token });
});

passport.deserializeUser((obj, cb) => cb(null, obj));

module.exports = passport;
