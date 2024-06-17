const { Router } = require('express');
const { Category } = require('../models/index.js');
const { validateCategory } = require('../utils/routeValidation.js');

const route = Router();

// GET /api/v1/categories - returns all categories or a single category if an id is provided
route.get('/categories(/:categoryId)?', async (req, res) => {
  if (req.params.categoryId) {
    const category = await Category.findByPk(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ Error: 'Category not found' });
    } else {
      return res.json(category.toJSON());
    }
  } else {
    const categories = (await Category.findAll()).map(category => category.toJSON());
    return res.json(categories);
  }
});

// POST /api/v1/categories - creates a new category
route.post('/categories', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ Error: 'Missing name' });
  }
  const { id, createdAt, updatedAt, ...rest } = req.body;
  try {
    const category = await Category.create(rest);
    return res.status(201).json(category.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// PUT /api/v1/categories/:categoryId - updates a category
route.put('/categories/:categoryId', validateCategory, async (req, res) => {
  const { category } = req;
  try {
    const { name } = req.body;
    if(!name) {
      return res.status(400).json({ Error: 'Missing name' });
    }
    await category.update({name: name});
    return res.json(category.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// DELETE /api/v1/categories/:categoryId - deletes a category
route.delete('/categories/:categoryId', validateCategory, async (req, res) => {
  const { category } = req;
  await category.destroy();
  return res.status(200).json({ Success: 'Category deleted' });
});

module.exports = route;
