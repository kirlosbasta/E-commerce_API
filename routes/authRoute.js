import { Router } from "express";
import passport from "passport";
import { Customer } from "../models/index.js";
import '../strategies/local_strategy.js';


const route = Router();

// POST /api/v1/auth/login - Login
route.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({message: 'Login successful'});
});

export default route;
