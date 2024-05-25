import express from "express";
import { Product } from "../models/index.js";
import { validateProduct } from "../utils/routeValidation.js";

const route = express.Router();


// GET /api/v1/products - returns all products or a single product if an id is provided
route.get('/products(/:productId)?', async (req, res) => {
  if (req.params.productId) {
    const product = await Product.findByPk(req.params.productId);
    if (!product) {
      return res.status(404).json({ Error: 'Product not found' });
    } else {
      return res.json(product.toJSON());
    }
  }
  else {
    const products = (await Product.findAll()).map(product => product.toJSON());
    return res.json(products);
  }
});

// POST /api/v1/products - creates a new product
route.post('/products', async (req, res) => {
  const { name, price } = req.body;
  if (!name) {
    return res.status(400).json({ Error: 'Missing name' });
  } else if (!price) {
    return res.status(400).json({ Error: 'Missing price' });
  }
  try {
    const { id, createdAt, updatedAt, ...rest } = req.body;
    const product = await Product.create(rest);
    return res.status(201).json(product.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// PUT /api/v1/products/:productId - updates a product
route.put('/products/:productId', validateProduct, async (req, res) => {
  const { product } = req;
  try {
    const { id, createdAt, updatedAt, ...rest } = req.body;
    await product.update(rest);
    return res.json(product.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// DELETE /api/v1/products/:productId - deletes a product
route.delete('/products/:productId', validateProduct, async (req, res) => {
  const { product } = req;
  await product.destroy();
  return res.status(200).json({ Success: 'Product deleted' });
});

export default route;
