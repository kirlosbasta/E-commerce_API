const Router = require("express").Router;
const passport = require("passport");

require('../strategies/local_strategy.js');


const route = Router();

// POST /api/v1/auth/login - Login
route.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({message: 'Login successful'});
});

module.exports = route;
