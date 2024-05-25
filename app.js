import { storage } from "./models/index.js"
import express from 'express';
import routes from './routes/index.js';

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
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Listhing on port ${PORT}`);
});

