import express from 'express';
import { Address, Customer } from '../models/index.js';
import { validataCustomer, validateAddress } from '../utils/routeValidation.js';


const route = express.Router();



// GET /api/v1/customers/<id>/addresses route - returns all addresses or a single address if an id is provided
route.get('/customers/:customerId/addresses(/:id)?', validataCustomer,  async (req, res) => {
  const { customer } = req;
  if (req.params.id) {
    const address = await Address.findByPk(req.params.id);
    if (!address) {
      return res.status(404).json({ Error: 'Address not found' });
    } else {
      return res.json(address.toJSON());
    }
  }
  else {
    const addresses = (await customer.getAddresses()).map(address => address.toJSON());
    return res.json(addresses);
  }
});

// DELETE /api/v1/customers/:customerId/addresses/:id route - deletes an address
route.delete('/customers/:customerId/addresses/:id', validataCustomer, validateAddress, async (req, res) => {
 const { address } = req;
  await address.destroy();
  res.status(200).send({ Success: 'Address deleted' });
});

// POST /api/v1/customers/:customerId/addresses route - creates a new address
route.post('/customers/:customerId/addresses', validataCustomer, async (req, res) => {
  const { customer } = req;
  const { body } = req;
  if (!body.street) {
    return res.status(400).json({ Error: 'Missing street' });
  } else if (!body.city) {
    return res.status(400).json({ Error: 'Missing city' });
  } else if (!body.state) {
    return res.status(400).json({ Error: 'Missing state' });
  } else if (!body.zipCode) {
    return res.status(400).json({ Error: 'Missing zipCode' });
  } else if (!body.country) {
    return res.status(400).json({ Error: 'Missing country' });
  } else {
    try {
      const { id, createdAt, updatedAt, ...rest } = body;
      rest.customerId = customer.id;
      const address = await Address.create(rest);
      await customer.addAddress(address);
      res.status(201).json(address.toJSON());
    } catch (e) {
      res.status(400).json({ Error: e.errors[0].message });
    }
  }
});

// PUT /api/v1/customers/:customerId/addresses/:id route - updates an address
route.put('/customers/:customerId/addresses/:id', validataCustomer, validateAddress, async (req, res) => {
  const { address } = req;
  try {
    const { id, createdAt, updatedAt, customerId, ...rest } = req.body;
    await address.update(rest);
    res.json(address.toJSON());
  } catch (e) {
    res.status(400).json({ Error: e.errors[0].message });
  }
});
export default route;