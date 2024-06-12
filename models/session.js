// this required for SequelizeStore because connect-session-sequelize is not compatible with ES6 modules
const session = require('express-session');
const storage = require('../config/database.js');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const Store = new SequelizeStore({
  db: storage.db
});

// sync the database to create the session table
(async () => {
  Store.sync();
}) ();

module.exports = Store;
