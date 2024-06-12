const { Router } = require('express');
const { Product, Category } = require('../models/index.js');
const { Op } = require('sequelize');

const route = Router();

// POST /api/v1/product_search - Search for a product by name, price range and category
// expect one name, one or two prices and a list of categories
route.post('/product_search', async (req, res) => {
  const { name, min, max, categories } = req.body;
  const conditions = [];
  let categoiresList;

  if (name) {
    conditions.push({ name: { [Op.startsWith]: name } });
  }
  if (min && max) {
    conditions.push({ price: { [Op.between]: [min, max] } });
  } else if (min) {
    conditions.push({ price: { [Op.gte]: min } });
  } else if (max) {
    conditions.push({ price: { [Op.lte]: max } });
  }
  if (categories) {
    categoiresList = await Category.findAll({ where: { id: categories } });
  }
  const options = {
    where: conditions.length > 0 ? { [Op.and]: conditions } : {}
  };

  const products = await Product.findAll(options);
  if (categoiresList) {
    const filteredProducts = [];
    for (const product of products) {
      if (await product.hasCategories(categoiresList)) {
        filteredProducts.push(product);
      }
    }
    return res.json(filteredProducts.map(product => product.toJSON()));
  }
  res.json(products.map(product => product.toJSON()));
});

module.exports = route;
