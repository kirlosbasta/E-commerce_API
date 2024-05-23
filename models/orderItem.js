import { Model, DataTypes } from 'sequelize';
import { storage } from '../config/database.js';


export default class OrderItem extends Model {
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
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    sequelize: storage.db,
    modelName: 'orderItem',
  }
);