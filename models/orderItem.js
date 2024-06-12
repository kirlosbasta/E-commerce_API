const { Model, DataTypes } = require('sequelize');
const storage = require('../config/database.js');


class OrderItem extends Model {
  /**
   * convert OrderItem Model to json format
   *
   * @returns (json) Json format of the file
   */
  toJSON() {
    const json = super.toJSON();
    json.model = 'OrderItem';
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


OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'quantity must be a number',
        },
        min: {
          args: [0],
          msg: 'quantity must be greater than 0',
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subTotal: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.price * this.quantity);
      },
      set(value) {
        throw new Error("Don't try to set subTotal");
      }
    }
  },
  {
    sequelize: storage.db,
    modelName: 'orderItem',
  }
);

module.exports = OrderItem;
