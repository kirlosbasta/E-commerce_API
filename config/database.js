// this file is used to create a new instance of the database class and to prevent circular import 
// issues in the application. The storage object is then exported to be used in other files.
import Database from "../models/engine/database.js";

const storage = new Database();

export { storage };
