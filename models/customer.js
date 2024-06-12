const { Model, DataTypes } = require('sequelize');
const storage = require('../config/database.js');
const { hashPassword } = require('../utils/helper.js');


class Customer extends Model {
  /**
   * convert Customer Model to json format
   *
   * @returns (json) Json format of the file
   */
  toJSON() {
    const json = super.toJSON();
    json.model = 'Customer';
    delete json.password;
    return json;
  }

  /**
   * Stringify json
   * @returns (string) Json string of the object
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}


Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email must be in the format example@exam.com'
        },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      set(value) {
        this.setDataValue('password', hashPassword(value));
      }
    },
  },
  {
    sequelize: storage.db,
    modelName: 'customer',
  }
);


module.exports = Customer;
