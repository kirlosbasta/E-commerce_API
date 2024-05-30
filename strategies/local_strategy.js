import passport from "passport";
import { Strategy } from "passport-local";
import { Customer } from "../models/index.js";
import { comparePassword } from "../utils/helper.js";


passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    done(null, customer);
  } catch(e) {
    done(e, null);
  }
});

export default passport.use(
  new Strategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      const customer = await Customer.findOne({ where: { email: email } });
      if (!customer) {
        throw new Error("Customer not found");
      }
      if (!comparePassword(password, customer.password)) {
        throw new Error("Invalid password");
      }
      done(null, customer);
    } catch(e) {
      done(e, null);
    }
  })
);
