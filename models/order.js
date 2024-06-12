const { Model, DataTypes } = require('sequelize');
const storage = require('../config/database.js');


class Order extends Model {
  /**
   * convert Order Model to json format
   *
   * @returns {json} Json format of the file
   */
  async toJSON() {
    const json = super.toJSON();
    json.model = 'Order';
    json.totalPrice = await this.getTotalPrice();
    json.totalQuantity = await this.getTotalQuantity();
    return json;
  }

  /**
   * Stringify Order 
   *
   * @returns {string} Json string of the object
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  /**
   * Get the total price of the order
   *
   * @returns {number} Total price 
   */
  async getTotalPrice() {
    let sum = 0;
    const orderItems = await this.getOrderItems();
    for (let orderItem of orderItems) {
      sum += orderItem.subTotal;
    }
    return sum;
  }

  /**
   * Get the Total quantity of the order
   * @returns {number} Total quantity
   */
  async getTotalQuantity() {
    let sum = 0;
    const orderItems = await this.getOrderItems();
    for (let orderItem of orderItems) {
      sum += orderItem.quantity;
    }
    return sum;
  }
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        isIn: {
          args: [['pending', 'completed', 'canceled']],
          msg: 'Status must be pending, completed or canceled',
        },
      },
      defaultValue: 'pending',
    },
  },
  {
    sequelize: storage.db,
    modelName: 'order',
  }
);

module.exports = Order;
