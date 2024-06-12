const { Model, DataTypes } = require('sequelize');
const storage = require('../config/database.js');


class Category extends Model {
  /**
   * convert Category Model to json format
   *
   * @returns (json) Json format of the file
   */
  toJSON() {
    const json = super.toJSON();
    if (json.productCategory) {
      delete json.productCategory;
    }
    json.model = "Category";
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

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: storage.db,
    modelName: "category",
  }
);

module.exports = Category;
