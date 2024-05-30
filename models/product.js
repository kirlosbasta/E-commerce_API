import { Model, DataTypes } from 'sequelize';
import { storage } from '../config/database.js';

export default class Product extends Model {
  /**
   * convert Product Model to json format
   *
   * @returns (json) Json format of the file
   */
  toJSON() {
    const json = super.toJSON();
    // Remove sequelize automatic insertion of both primary keys of product and category
    if (json.productCategory) {
      delete json.productCategory;
    }
    json.model = 'Product';
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

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Price must be a number',
      },
      min: {
        args: [0],
        msg: 'Price must be greater than 0',
      },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Stock must be an integer',
      },
      min: {
        args: [0],
        msg: 'Stock must be greater than or equal to 0',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize: storage.db,
  modelName: 'product',
});
