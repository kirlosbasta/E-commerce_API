const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor () {
    this.db = new Sequelize(
      process.env.ECOMM_MYSQL_DATABASE,
      process.env.ECOMM_MYSQL_USER,
      process.env.ECOMM_MYSQL_PWD, {
        host: process.env.ECOMM_MYSQL_HOST,
        dialect: 'mysql',
        logging: false
      });
    if (process.env.ECOMM_ENV === 'test') {
      this.db.drop();
    }
  }

  async connect () {
    try {
      await this.db.authenticate();
      console.log('Connection has been established successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }

  async sync () {
    await this.db.sync();
  }

  async all (model = null) {
    if (model === null) {
      const objects = [];
      for (const key in this.db.models) {
        objects.push(...(await this.db.models[key].findAll()));
      }
      return objects;
    } else {
      return await model.findAll();
    }
  }

  async count (model = null) {
    if (model) {
      return await model.count();
    } else {
      let sum = 0;
      for (const key in this.db.models) {
        sum += await this.db.models[key].count();
      }
      return sum;
    }
  }
}

module.exports = Database;
