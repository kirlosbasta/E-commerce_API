import { Customer, Address, Product, Category } from '../models/index.js';

// Middleware to validate a customer exists

export async function validataCustomer (req, res, next) {
  const { customerId } = req.params;
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    return res.status(404).json({ Error: 'Customer not found' });
  }
  req.customer = customer;
  next();
}

// Middleware to validate an address exists
export async function validateAddress (req, res, next) {
  const address = await Address.findByPk(req.params.id);
  if (!address) {
    return res.status(404).json({ Error: 'Address not found' });
  }
  req.address = address;
  next();
}

// Middleware to validate a product exists
export async function validateProduct (req, res, next) {
  const product = await Product.findByPk(req.params.productId);
  if (!product) {
    return res.status(404).json({ Error: 'Product not found' });
  }
  req.product = product;
  next();
}

// Middleware to validate a category exists
export async function validateCategory (req, res, next) {
  const category = await Category.findByPk(req.params.categoryId);
  if (!category) {
    return res.status(404).json({ Error: 'Category not found' });
  }
  req.category = category;
  next();
}
