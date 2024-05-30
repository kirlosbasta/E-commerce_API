import { storage, Store } from "./models/index.js"
import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import routes from './routes/index.js';
import "./strategies/local_strategy.js";


const PORT = process.env.ECOMM_PORT || 5000;

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
  secret: 'AQSGaHYejNtjnUtxbS4pRDrUKPVq9w9k',
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

app.listen(PORT, () => {
  console.log(`Listhing on port ${PORT}`);
});
