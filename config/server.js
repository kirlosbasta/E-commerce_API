const { storage, Store } = require('../models/index.js');
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");
const routes = require('../routes/index.js');
require('../strategies/local_strategy.js');

function createApp() {

  const app = express();

  app.use(express.json({
    verify : (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch(e) {
        res.status(404).json({Error: 'Invalid JSON'});
      }
    }
  }));
  
  app.use(cors());
  app.use(session({
    secret: process.env.ECOMM_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 60000 * 60 * 24,
     },
     store: Store
  }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use('/api/v1', routes);
  
  app.all('*', (req, res) => {
    res.status(404).json({Error: 'Not Found'});
  });

  return app;
}

module.exports = createApp;