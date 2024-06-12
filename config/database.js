// this file is used to create a new instance of the database class and to prevent circular import
// issues in the application. The storage object is then exported to be used in other files.
const Database = require('../models/engine/database.js');

const storage = new Database();

module.exports = storage;
