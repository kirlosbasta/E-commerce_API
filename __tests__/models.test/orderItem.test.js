const { Order, Customer, OrderItem, Product, storage } = require('../../models/index.js');

let order, customer, address1, item1, item2, product1, product2, oldQuantity;

describe('Test OrderItems', () => {
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

    oldQuantity = product1.stock;

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

  it('should create an order item', async () => {
    const json = await item1.toJSON();
    expect(item1).toBeInstanceOf(OrderItem);
    expect(json).toHaveProperty('id', item1.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('quantity', 2);
    expect(json).toHaveProperty('price', product1.price);
    expect(json).toHaveProperty('subTotal', 100);
    expect(json).toHaveProperty('model', 'OrderItem');
  });

  it('should not create an order item without a quantity', async () => {
    try {
      await OrderItem.create({
        price: 50,
        orderId: order.id,
        productId: product1.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create an order item without a price', async () => {
    try {
      await OrderItem.create({
        quantity: 2,
        orderId: order.id,
        productId: product1.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create an order item without a orderId', async () => {
    try {
      await OrderItem.create({
        quantity: 2,
        price: 50,
        productId: product1.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create an order item without a productId', async () => {
    try {
      await OrderItem.create({
        quantity: 2,
        price: 50,
        orderId: order.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have a subTotal', async () => {
    expect(item1.subTotal).toBe(100);
  });

  it('should have setOrder method', async () => {
    expect(item1.setOrder).toBeInstanceOf(Function);
  });

  it('should have setProduct method', async () => {
    expect(item1.setProduct).toBeInstanceOf(Function);
  });

  it('should have getOrder method', async () => {
    expect(item1.getOrder).toBeInstanceOf(Function);
  });

  it('should have getProduct method', async () => {
    expect(item1.getProduct).toBeInstanceOf(Function);
  });

  it('should have createOrder method', async () => {
    expect(item1.createOrder).toBeInstanceOf(Function);
  });

  it('should have createProduct method', async () => {
    expect(item1.createProduct).toBeInstanceOf(Function);
  });
});
