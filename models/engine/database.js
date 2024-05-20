import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

class Database {
  constructor() {
    this.db = new Sequelize(
      process.env.ECOMM_MYSQL_DATABASE,
      process.env.ECOMM_MYSQL_USER,
      process.env.ECOMM_MYSQL_PWD, {
      host: process.env.ECOMM_MYSQL_HOST,
      dialect: 'mysql',
    });
  }
  connect () {
    this.db.authenticate()
    .then(() => { 
      console.log('Connection has been established successfully.'); 
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  }

  async sync () {
    await this.db.sync({ alter: true });
  }
}

export default Database;
