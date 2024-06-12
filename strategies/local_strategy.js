const passport = require("passport");
const { Strategy } = require("passport-local");
const { Customer } = require("../models/index.js");
const { comparePassword } = require("../utils/helper.js");


passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return req.res.status(404).json({Error: 'Customer not found'});
    }
    done(null, customer);
  } catch(e) {
    done(e, null);
  }
});

passport.use(
  new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, async (req, email, password, done) => {
    try {
      const customer = await Customer.findOne({ where: { email: email } });
      if (!customer) {
        return req.res.status(404).json({Error: 'Customer not found'});
      }
      if (!comparePassword(password, customer.password)) {
        return req.res.status(401).json({Error: 'Invalid Password'});
      }
      done(null, customer);
    } catch(e) {
      done(e, null);
    }
  })
);

module.exports = passport;
