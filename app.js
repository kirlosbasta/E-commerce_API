// Description: Main entry point for the application. This file creates the express app and starts the server.
const createApp = require('./config/server.js');

const app = createApp();

const PORT = process.env.ECOMM_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
