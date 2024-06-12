const { Router } = require('express');
const { Customer } = require('../models/index.js');
const { validataCustomer } = require('../utils/routeValidation.js');

const route = Router();

// GET /api/v1/customers - returns all customers or a single customer if an id is provided
route.get('/customers(/:customerId)?', async (req, res) => {
  if (req.params.customerId) {
    const customer = await Customer.findByPk(req.params.customerId);
    if (customer) {
      res.json(customer.toJSON());
    } else {
      res.status(404).json({ Error: 'Customer not found' });
    }
  } else {
    const customers = (await Customer.findAll()).map(customer => customer.toJSON());
    res.json(customers);
  }
});

// POST /api/v1/customers - creates a new customer

route.post('/customers', async (req, res) => {
  const { body } = req;
  if (!body.firstName) {
    return res.status(400).json({ Error: 'Missing firstName' });
  } else if (!body.lastName) {
    return res.status(400).json({ Error: 'Missing lastName' });
  } else if (!body.email) {
    return res.status(400).json({ Error: 'Missing email' });
  } else if (!body.password) {
    return res.status(400).json({ Error: 'Missing password' });
  }

  try {
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;
    const customer = await Customer.create(body);
    return res.status(201).json(customer.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// DELETE /api/v1/customers/:customerId - deletes a customer
route.delete('/customers/:customerId', validataCustomer, async (req, res) => {
  const { customer } = req;
  await customer.destroy();
  res.status(200).json({ Success: 'Customer deleted' });
});

// PUT /api/v1/customers/:customerId - updates a customer
route.put('/customers/:customerId', validataCustomer, async (req, res) => {
  const { customer } = req;
  try {
    const { id, createdAt, updatedAt, email, ...rest } = req.body;
    await customer.update(rest);
    res.json(customer.toJSON());
  } catch (e) {
    res.status(400).json({ Error: e.errors[0].message });
  }
});

module.exports = route;
