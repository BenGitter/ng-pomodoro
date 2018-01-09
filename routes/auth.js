// Dependencies
const router = require('express').Router();

const passport = require('../helpers/passport');
const { generateToken } = require('../helpers/utils');

// Route to Trello authentication
router.get('/trello', passport.authenticate('trello'));

// Callback route
router.get('/trello/callback', passport.authenticate('trello', {
  failureRedirect: '/api',
}), generateToken, (req, res) => {
  res.render('success', { token: JSON.stringify(req.token) });
});

module.exports = router;
