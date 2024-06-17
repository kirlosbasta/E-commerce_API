const { or } = require('sequelize');
const createApp = require('../../config/server');
const { storage, Product, Order, OrderItem, Customer, Address } = require('../../models/index');
const request = require('supertest');


describe('Test orderRoute', () => {
  let app, customer, product1, product2, order, orderItem1, orderItem2, address, cookie;
  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    customer = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'JohnDoes@gmail.com',
      password: 'password'
    });
    address = await customer.createAddress({
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: 62701,
      country: 'USA',
      houseNumber: '32',
      phoneNumber: '+1234567890',
      additionalPhoneNumber: '+2839483948',
      floor: 5,
      description: 'This is a description'
    });
    
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: customer.email,
        password: 'password'
      });
    cookie = login.headers['set-cookie'];
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  beforeEach(async () => {
    product1 = await Product.create({ name: 'product1', price: 10.5, stock: 10, description: 'product1'});
    product2 = await Product.create({ name: 'product2', price: 20.5, stock: 20, description: 'product2'});
    order = await Order.create({ addressId: address.id, customerId: customer.id});
    orderItem1 = await OrderItem.create({ orderId: order.id, productId: product1.id, quantity: 2, price: product1.price});
    orderItem2 = await OrderItem.create({ orderId: order.id, productId: product2.id, quantity: 3, price: product2.price});
  });

  afterEach(async () => {
    await orderItem1.destroy();
    await orderItem2.destroy();
    await order.destroy();
    await product1.destroy();
    await product2.destroy();
  });

  it('should fail if not authenticated', async () => {
    const res = await request(app).post('/api/v1/orders').send({
      addressId: address.id,
      orderItems: [
        { productId: product1.id, quantity: 2 },
        { productId: product2.id, quantity: 3 }
      ]
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ Error: 'Unauthenticated' });
  });

  describe('GET /api/v1/orders', () => {
    it('should GET all orders', async () => {
      const res = await request(app).get('/api/v1/orders').set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('model', 'Order');
      expect(res.body[0]).toHaveProperty('totalPrice', 10.5 * 2 + 20.5 * 3);
      expect(res.body[0]).toHaveProperty('totalQuantity', 2 + 3);
      expect(res.body[0]).toHaveProperty('address');
      expect(res.body[0].address).toHaveProperty('street', '123 Main St');
      expect(res.body[0].address).toHaveProperty('city', 'Springfield');
      expect(res.body[0]).toHaveProperty('orderItems');
      expect(res.body[0].orderItems).toHaveLength(2);
      expect(res.body[0].orderItems[0]).toHaveProperty('productId');
      expect(res.body[0].orderItems[0]).toHaveProperty('quantity');
      expect(res.body[0].orderItems[0]).toHaveProperty('price');
      expect(res.body[0].orderItems[1]).toHaveProperty('productId');
      expect(res.body[0].orderItems[1]).toHaveProperty('quantity');
      expect(res.body[0].orderItems[1]).toHaveProperty('price');
      expect(res.body[0].orderItems[0]).toHaveProperty('subTotal');
      expect(res.body[0].orderItems[1]).toHaveProperty('subTotal');
    });

    it('should GET order by id', async () => {
      const res = await request(app).get(`/api/v1/orders/${order.id}`).set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('model', 'Order');
      expect(res.body).toHaveProperty('totalPrice', 10.5 * 2 + 20.5 * 3);
      expect(res.body).toHaveProperty('totalQuantity', 2 + 3);
      expect(res.body).toHaveProperty('address');
      expect(res.body.address).toHaveProperty('street', '123 Main St');
      expect(res.body.address).toHaveProperty('city', 'Springfield');
      expect(res.body).toHaveProperty('orderItems');
      expect(res.body.orderItems).toHaveLength(2);
      expect(res.body.orderItems[0]).toHaveProperty('productId');
      expect(res.body.orderItems[0]).toHaveProperty('quantity');
      expect(res.body.orderItems[0]).toHaveProperty('price');
      expect(res.body.orderItems[1]).toHaveProperty('productId');
      expect(res.body.orderItems[1]).toHaveProperty('quantity');
      expect(res.body.orderItems[1]).toHaveProperty('price');
      expect(res.body.orderItems[0]).toHaveProperty('subTotal');
      expect(res.body.orderItems[1]).toHaveProperty('subTotal');
    });

    it('should fail if order is not found', async () => {
      const res = await request(app).get('/api/v1/orders/999').set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });
  });

  describe('GET /api/v1/orders/:orderId/address', () => {
    it('should GET order address', async () => {
      const res = await request(app).get(`/api/v1/orders/${order.id}/address`).set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('street', '123 Main St');
      expect(res.body).toHaveProperty('city', 'Springfield');
    });

    it('should fail if order is not found', async () => {
      const res = await request(app).get('/api/v1/orders/999/address').set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });
  });

  describe('GET /api/v1/orders/:orderId/orderItems', () => {
    it('should GET order items', async () => {
      const res = await request(app).get(`/api/v1/orders/${order.id}/orderItems`).set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('productId');
      expect(res.body[0]).toHaveProperty('quantity');
      expect(res.body[0]).toHaveProperty('price');
      expect(res.body[0]).toHaveProperty('subTotal');
      expect(res.body[1]).toHaveProperty('productId');
      expect(res.body[1]).toHaveProperty('quantity');
      expect(res.body[1]).toHaveProperty('price');
      expect(res.body[1]).toHaveProperty('subTotal');
    });

    it('should fail if order is not found', async () => {
      const res = await request(app).get('/api/v1/orders/999/orderItems').set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });
  });

  describe('POST', () => {
    it('should create a new order', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('model', 'Order');
      expect(res.body).toHaveProperty('totalPrice', 10.5 * 2 + 20.5 * 3);
      expect(res.body).toHaveProperty('totalQuantity', 2 + 3);
      expect(res.body).toHaveProperty('orderItems');
      expect(res.body.orderItems).toHaveLength(2);
      expect(res.body.orderItems[0]).toHaveProperty('productId');
      expect(res.body.orderItems[0]).toHaveProperty('quantity');
      expect(res.body.orderItems[0]).toHaveProperty('price');
      expect(res.body.orderItems[1]).toHaveProperty('productId');
      expect(res.body.orderItems[1]).toHaveProperty('quantity');
      expect(res.body.orderItems[1]).toHaveProperty('price');
      expect(res.body.orderItems[0]).toHaveProperty('subTotal');
      expect(res.body.orderItems[1]).toHaveProperty('subTotal');
    });

    it('should fail if addressId is missing', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        orderItems: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing addressId' });
    });

    it('should fail if orderItems is missing', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing orderItems' });
    });

    it('should fail if orderItems is empty', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: []
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'orderItems cannot be empty' });
    });

    it('should fail if product is not found', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: 999, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Product: 999 is not found' });
    });

    it('should fail if quantity is not a number', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: product1.id, quantity: 'quantity' },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be a number' });
    });

    it('should fail if quantity is less than 1', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: product1.id, quantity: 0 },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be greater than 0' });
    });

    it('should fail if quantity exceed stock', async () => {
      const res = await request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: product1.id, quantity: 11 },
          { productId: product2.id, quantity: 3 }
        ]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: `Quantity exceeds stock capacity: ${product1.stock}.` });
    });

    it('should decrement stock', async () => {
      const beforeStock = product1.stock;
      const res = await  request(app).post('/api/v1/orders').set('Cookie', cookie).send({
        addressId: address.id,
        orderItems: [
          { productId: product1.id, quantity: 2 }
        ]
      });
      product1 = await product1.reload();
      expect(res.statusCode).toBe(201);
      expect(product1.stock).toBe(beforeStock - 2);
    });
  });

  describe('PUT', () => {
    it('should update the order', async() => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}`)
      .set('Cookie', cookie)
      .send({ status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'completed');
    });

    it('should fail if order is not found', async () => {
      const res = await request(app)
      .put('/api/v1/orders/999')
      .set('Cookie', cookie)
      .send({ status: 'completed' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });

    it('should ignore id, createdAt, updatedAt, customerId', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}`)
      .set('Cookie', cookie)
      .send({ status: 'completed', id: '1234', createdAt: '2020-01', updatedAt: '2020-02', customerId: '1234' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'completed');
      expect(res.body).not.toHaveProperty('id', '1234');
      expect(res.body).not.toHaveProperty('createdAt', '2020-01');
      expect(res.body).not.toHaveProperty('updatedAt', '2020-02');
      expect(res.body).not.toHaveProperty('customerId', '1234');
    });
  });

  describe('DELETE', () => {
    it('should delete the order', async () => {
      const res = await request(app)
      .delete(`/api/v1/orders/${order.id}`)
      .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'Order canceled' });
    });

    it('should fail if order is not found', async () => {
      const res = await request(app)
      .delete('/api/v1/orders/999')
      .set('Cookie', cookie);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });
  });

  describe('POST /api/v1/orders/:orderId/orderItems', () => {
    it('should add items to the order', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('model', 'Order');
      expect(res.body).toHaveProperty('totalPrice', 165);
      expect(res.body).toHaveProperty('totalQuantity', 10);
      expect(res.body).toHaveProperty('orderItems');
      expect(res.body.orderItems).toHaveLength(2);
    });

    it('should fail if order is not found', async () => {
      const res = await request(app)
      .post('/api/v1/orders/999/orderItems')
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Order not found' });
    });

    it('should fail if orderItems is missing', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing orderItems' });
    });

    it('should fail if orderItems is empty', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({ orderItems: [] });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'orderItems cannot be empty' });
    });

    it('should fail if product is not found', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: 999, quantity: 2 },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Product: 999 is not found' });
    });

    it('should fail if quantity is not a number', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 'quantity' },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be a number' });
    });

    it('should fail if quantity is less than 1', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 0 },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be greater than 0' });
    });

    it('should fail if quantity is greater than stock', async () => {
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 11 },
          { productId: product2.id, quantity: 3 }
        ]
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: `Quantity exceeds stock capacity: ${product1.stock}.` });
    });

    it('should create new orderItem if not exists', async () => {
      const product3 = await Product.create({ name: 'product3', price: 15.5, stock: 30, description: 'product3' });
      const beforePrice = await order.getTotalPrice();
      const beforeQuantity = await order.getTotalQuantity();
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product3.id, quantity: 2 }
        ]
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'pending');
      expect(res.body).toHaveProperty('model', 'Order');
      expect(res.body).toHaveProperty('totalPrice', 15.5 * 2 + beforePrice);
      expect(res.body).toHaveProperty('totalQuantity', 2 + beforeQuantity);
      expect(res.body).toHaveProperty('orderItems');
      expect(res.body.orderItems).toHaveLength(3);
    });

    it('should decrement product stock', async () => {
      const beforeStock = product1.stock;
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 2 }
        ]
      });

      expect(res.statusCode).toBe(201);
      const product = await Product.findByPk(product1.id);
      expect(product.stock).toBe(beforeStock - 2);
    });

    it('should increment orderItem quantity if exists', async () => {
      const beforeQuantity = orderItem1.quantity;
      const res = await request(app)
      .post(`/api/v1/orders/${order.id}/orderItems`)
      .set('Cookie', cookie)
      .send({
        orderItems: [
          { productId: product1.id, quantity: 2 }
        ]
      });

      expect(res.statusCode).toBe(201);
      const orderItem = await OrderItem.findByPk(orderItem1.id);
      expect(orderItem.quantity).toBe(beforeQuantity + 2);
      const product = await Product.findByPk(product1.id);
      expect(product.stock).toBe(product1.stock - 2);
    });
  });

  describe('PUT /api/v1/orders/:orderId/orderItems/:orderItemId', () => {
    it('should update orderItem', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('quantity', 5);
    });

    it('should fail if quantity is missing', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing quantity' });
    });

    it('should fail if quantity exceed stock', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({ quantity: 11 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: `Quantity exceeds stock capacity: ${product1.stock}.` });
    });

    it('should increment stock and decrement stock', async () => {
      const beforeStock = product1.stock;
      const beforeQuantity = orderItem1.quantity;
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      const product = await Product.findByPk(product1.id);
      expect(product.stock).toBe(beforeStock + beforeQuantity - 5);
    });

    it('should fail if orderItem is not found', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/999`)
      .set('Cookie', cookie)
      .send({ quantity: 5 });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'OrderItem not found' });
    });

    it('should fail if quantity is not a number', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({ quantity: 'quantity' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be a number' });
    });

    it('should fail if quantity is less than 1', async () => {
      const res = await request(app)
      .put(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie)
      .send({ quantity: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Quantity must be greater than 0' });
    });
  });

  describe('DELETE /api/v1/orders/:orderId/orderItems/:orderItemId', () => {
    it('should delete orderItem', async () => {
      const res = await request(app)
      .delete(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'OrderItem deleted' });
    });

    it('should fail if orderItem is not found', async () => {
      const res = await request(app)
      .delete(`/api/v1/orders/${order.id}/orderItems/999`)
      .set('Cookie', cookie);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'OrderItem not found' });
    });

    it('should increment stock', async () => {
      const beforeStock = product1.stock;
      const res = await request(app)
      .delete(`/api/v1/orders/${order.id}/orderItems/${orderItem1.id}`)
      .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      const product = await Product.findByPk(product1.id);
      expect(product.stock).toBe(beforeStock + orderItem1.quantity);
    });
  });
});