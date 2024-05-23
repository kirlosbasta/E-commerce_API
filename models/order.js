import { Model, DataTypes } from 'sequelize';
import { storage } from '../config/database.js';


export default class Order extends Model {
  /**
   * convert Order Model to json format
   *
   * @returns (json) Json format of the file
   */
  toJSON() {
    const json = super.toJSON();
    json.model = 'Order';
    return json;
  }

  /**
   * Stringify Order 
   *
   * @returns (string) Json string of the object
   */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
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
