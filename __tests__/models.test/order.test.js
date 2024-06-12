const { json } = require('sequelize');
const { Order, Customer, OrderItem, Product, storage } = require('../../models/index.js');

let order, customer, address1, item1, item2, product1, product2;

describe('Test Order', () => {
  beforeAll(async () => {
    await storage.sync();

    customer = await Customer.create(
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'JohnDoe@gmail.com',
        password: 'password'
      });
    address1 = await customer.createAddress({
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
    order = await Order.create({
      status: 'pending',
      customerId: customer.id,
      addressId: address1.id
    });

    product1 = await Product.create({
      name: 'iphone 4',
      price: 50,
      stock: 10,
      description: 'Older phone'
    });

    product2 = await Product.create({
      name: 'iphone 5',
      price: 100,
      stock: 20,
      description: 'Old phone'
    });
    item1 = await OrderItem.create({
      quantity: 2,
      price: product1.price,
      orderId: order.id,
      productId: product1.id
    });

    item2 = await OrderItem.create({
      quantity: 1,
      price: product2.price,
      orderId: order.id,
      productId: product2.id
    });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should create an order', async () => {
    const json = await order.toJSON();
    expect(order).toBeInstanceOf(Order);
    expect(json).toHaveProperty('id', order.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('status', 'pending');
    expect(json).toHaveProperty('totalPrice', 200);
    expect(json).toHaveProperty('totalQuantity', 3);
    expect(json).toHaveProperty('model', 'Order');
  });

  it('should not create an order without a status', async () => {
    try {
      await Order.create({
        description: 'All electronics'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have status from one of (pending, completed, canceled)', async () => {
    try {
      await Order.create({
        status: 'undefined'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have getOrderItems method', async () => {
    expect(order.getOrderItems).toBeInstanceOf(Function);
  });

  it('should have getTotalPrice method', async () => {
    expect(order.getTotalPrice).toBeInstanceOf(Function);
  });

  it('should have getTotalQuantity method', async () => {
    expect(order.getTotalQuantity).toBeInstanceOf(Function);
  });

  it('should have setOrderItems method', async () => {
    expect(order.setOrderItems).toBeInstanceOf(Function);
  });

  it('should have addOrderItem method', async () => {
    expect(order.addOrderItem).toBeInstanceOf(Function);
  });

  it('should have removeOrderItem method', async () => {
    expect(order.removeOrderItem).toBeInstanceOf(Function);
  });

  it('should have countOrderItems method', async () => {
    expect(order.countOrderItems).toBeInstanceOf(Function);
  });

  it('should have createOrderItem method', async () => {
    expect(order.createOrderItem).toBeInstanceOf(Function);
  });

  it('should have getCustomer method', async () => {
    expect(order.getCustomer).toBeInstanceOf(Function);
  });

  it('should have setCustomer method', async () => {
    expect(order.setCustomer).toBeInstanceOf(Function);
  });

  it('should have getAddress method', async () => {
    expect(order.getAddress).toBeInstanceOf(Function);
  });

  it('should have setAddress method', async () => {
    expect(order.setAddress).toBeInstanceOf(Function);
  });

  it('should have totalQuantity', async () => {
    const json = await order.toJSON();
    expect(json.totalQuantity).toBe(3);
  });

  it('should have totalPrice', async () => {
    const json = await order.toJSON();
    expect(json.totalPrice).toBe(200);
  });
});
