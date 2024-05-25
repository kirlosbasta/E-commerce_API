import express from 'express';
import { Customer } from '../models/index.js';
import { validataCustomer } from '../utils/routeValidation.js';

const route = express.Router();


// GET /api/v1/customers - returns all customers or a single customer if an id is provided
route.get('/customers(/:id)?', async (req, res) => {
  if (req.params.id) {
    const customer = await Customer.findByPk(req.params.id);
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
    res.status(400).json({Error: "Missing firstName"});
  } else if (!body.lastName) {
    res.status(400).json({Error: "Missing lastName"});
  } else if (!body.email) {
    res.status(400).json({Error: "Missing email"});
  } else if (!body.password) {
    res.status(400).json({Error: "Missing password"});
  } else if (!body.phoneNumber) {
    res.status(400).json({Error: "Missing phoneNumber"});
  } 
  try {
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;
    const customer = await Customer.create(body);
    res.status(201).json(customer.toJSON());
  } catch (e) {
    res.status(400).json({Error: e.errors[0].message});
  }
});

// DELETE /api/v1/customers/:id - deletes a customer
route.delete('/customers/:customerId', validataCustomer, async (req, res) => {
  const { customer } = req;
  await customer.destroy();
  res.status(200).json({ Success: 'Customer deleted' });
});

// PUT /api/v1/customers/:id - updates a customer
route.put('/customers/:customerId', validataCustomer, async (req, res) => {
  const { customer } = req;
  try {
    const {id, createdAt, updatedAt, ...rest} = req.body;
    await customer.update(rest);
    res.json(customer.toJSON());
  } catch (e) {
    res.status(400).json({Error: e.errors[0].message});
  }
});



export default route;