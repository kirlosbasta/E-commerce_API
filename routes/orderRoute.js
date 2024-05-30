import { Router } from "express";
import { Address, Order, OrderItem, Product } from "../models/index.js";
import { validataOrder, validateOrderItem } from "../utils/routeValidation.js";
import { isAuthenticated } from "../utils/middelware.js";


const route = Router();
route.use(isAuthenticated);

// GET /api/v1/orders/:orderId - returns all orders
route.get('/orders(/:orderId)?', async (req, res) => {
  const { user: customer } = req;
  if (req.params.orderId) {
    const order = await Order.findByPk(req.params.orderId, {include: [ OrderItem, Address ]});
    if (!order) {
      return res.status(404).json({ Error: 'Order not found' });
    } else {
      return res.json(await order.toJSON());
    }
  }
  else {
    const orders = await customer.getOrders({include: [ OrderItem, Address ]});
    const jsonOrders = [];
    for (let i = 0; i < orders.length; i++) {
      jsonOrders[i] = await orders[i].toJSON();
    }
    return res.json(jsonOrders);
  }
});

// GET /api/v1/orders/:orderId/address - returns order address
route.get('/orders/:orderId/address', validataOrder, async (req, res) => {
  const { order } = req;
  const address = await order.getAddress();
  return res.json(address.toJSON());
});

// GET /api/v1/orders/:orderId/orderItems - returns order items
route.get('/orders/:orderId/orderItems', validataOrder, async (req, res) => {
  const { order } = req;
  const items = (await order.getOrderItems({ include: Product })).map(item => item.toJSON());
  res.json(items);
});

// POST /api/v1/orders - creates a new order
route.post('/orders', async (req, res) => {
  try {
    const { user: customer } = req;
    const { addressId } = req.body;
    const order = await Order.create({ customerId: customer.id, addressId: addressId });
    return res.status(201).json(await order.toJSON());
  } catch (e) { 
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// PUT /api/v1/orders/:orderId - updates an order
route.put('/orders/:orderId', validataOrder, async (req, res) => {
  try {
    const { order } = req;
    const { id, createdAt, updatedAt, customerId, ...rest } = req.body;
    await order.update(rest);
    return res.json(await order.toJSON());  
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
  
});

// DELETE /api/v1/orders/:orderId - deletes an order
route.delete('/orders/:orderId', validataOrder, async (req, res) => {
  const { order } = req;
  await order.update({ status: 'canceled' });
  return res.status(200).json({ Success: 'Order canceled' });
});

// POST /api/v1/orders/:orderId/orderItems - add an item to the order
// accepts a list of objects contain productId and quantity
route.post('/orders/:orderId/orderItems', validataOrder, async (req, res) => {
  const { order, body: { orderItems } } = req;
  if (!orderItems) {
    return res.status(400).json({ Error: 'Missing orderItems' });
  } else if (orderItems.length === 0) {
    return res.status(400).json({ Error: 'orderItems cannot be empty' });
  }
  for (let item of orderItems) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      return res.status(400).json({ Error: `Product: ${item.productId} is not found` });
    }
    if (isNaN(item.quantity)) {
      return res.status(400).json({ Error: 'Quantity must be a number' });
    }
    if (item.quantity < 1) {
      return res.status(400).json({ Error: 'Quantity must be greater than 0' });
    } else if (item.quantity > product.stock) {
      return res.status(400).json({ Error: `Quantity exceeds stock capacity: ${product.stock}.` });
    }
    try {
      let existItems = await order.getOrderItems({ where: { productId: item.productId } });
      if (existItems.length === 0) {
        await OrderItem.create({ orderId: order.id, productId: product.id, price: product.price, quantity: item.quantity });
        await product.decrement({ 'stock': item.quantity });
      } else {
        let existItem = existItems[0];
        await existItem.increment({ 'quantity': item.quantity });
        await product.decrement({ 'stock': item.quantity });
      }
    } catch (e) {
      return res.status(400).json({ Error: e.errors[0].message });
    }
  }
  return res.status(201).json((await order.getOrderItems()).map(item => item.toJSON()));
});
// PUT /api/v1/orders/:orderId/orderItems/:orderItemId - update order item
// accepts quantity
route.put('/orders/:orderId/orderItems/:orderItemId', validataOrder, validateOrderItem, async (req, res) => {
  const { order, orderItem, params: { orderItemId }, body: { quantity } } = req;
  if (!quantity) {
    return res.status(400).json({ Error: 'Missing quantity' });
  }
  const product = await Product.findByPk(orderItem.productId);
  if (quantity > product.stock) {
    return res.status(400).json({ Error: `Quantity exceeds stock capacity: ${product.stock}.` });
  }
  try {
    const oldQuantity = orderItem.quantity;
    await orderItem.update({ quantity: quantity });
    await product.increment({ 'stock': oldQuantity });
    await product.decrement({ 'stock': quantity });
    return res.json(await orderItem.toJSON());
  } catch (e) {
    return res.status(400).json({ Error: e.errors[0].message });
  }
});

// DELETE /api/v1/orders/:orderId/orderItems/:orderItemId - delete order item
route.delete('/orders/:orderId/orderItems/:orderItemId', validataOrder, validateOrderItem, async (req, res) => {
  const { orderItem } = req;
  const product = await Product.findByPk(orderItem.productId);
  await product.increment({ 'stock': orderItem.quantity });
  await orderItem.destroy();
  return res.status(200).json({ Success: 'OrderItem deleted' });
});


export default route;