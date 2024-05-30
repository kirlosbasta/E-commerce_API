// this required for SequelizeStore because connect-session-sequelize is not compatible with ES6 modules
import session from 'express-session';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const SequelizeStore = require('connect-session-sequelize')(session.Store);
import { storage } from '../config/database.js';

const Store = new SequelizeStore({
  db: storage.db
});

// sync the database to create the session table
(async () => {
  Store.sync();
}) ();

export default Store;
