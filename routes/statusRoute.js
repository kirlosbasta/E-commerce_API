const { Router } = require('express');
const isAuthenticated = require('../utils/middelware.js');

const route = Router();

// GET /api/v1/status - Get the status of the API
route.get('/status', isAuthenticated, (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = route;
