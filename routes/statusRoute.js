import { Router } from "express";
import { isAuthenticated } from "../utils/middelware.js";


const route = Router();

// GET /api/v1/status - Get the status of the API
route.get('/status', isAuthenticated, (req, res) => {
  res.status(200).json({status: 'ok'});
});

export default route;
