const { Router } = require('express');
const { validateCategory, validateProduct } = require('../utils/routeValidation.js');

const route = Router();

// GET /api/v1/products/:productId/categories - Get all categories for a product
route.get('/products/:productId/categories', validateProduct, async (req, res) => {
  const { product } = req;
  const categories = (await product.getCategories()).map(category => category.toJSON());
  return res.status(200).json(categories);
});

// GET /api/v1/categories/:categoryId/products - Get all products for a category
route.get('/categories/:categoryId/products', validateCategory, async (req, res) => {
  const { category } = req;
  const products = (await category.getProducts()).map(product => product.toJSON());
  return res.status(200).json(products);
});

// POST /api/v1/products/:productId/categories/:categoryId - Link a category to a product
route.post('/products/:productId/categories/:categoryId', validateProduct, validateCategory, async (req, res) => {
  const { product, category } = req;
  if (await product.hasCategory(category)) {
    return res.status(200).json(category.toJSON());
  }
  await product.addCategory(category);
  return res.status(201).json({});
});

// DELETE /api/v1/products/:productId/categories/:categoryId - Unlink a category from a product
route.delete('/products/:productId/categories/:categoryId', validateProduct, validateCategory, async (req, res) => {
  const { product, category } = req;
  if (!await product.hasCategory(category)) {
    return res.status(404).json({ Error: 'Category not linked to product' });
  }
  await product.removeCategory(category);
  return res.status(200).json({});
});
module.exports = route;
