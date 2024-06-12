const { Sequelize } = require('sequelize');
const Database = require('../../../models/engine/database.js');
const { Product, Category, storage } = require('../../../models/index.js');

let product1, product2, category;

describe('Test Database', () => {
  beforeAll(async () => {
    await storage.sync();
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

    category = await Category.create({
      name: 'Phones'
    });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should create a database', () => {
    expect(storage).toBeInstanceOf(Database);
  });

  it('should have a connection method', () => {
    expect(storage.connect).toBeInstanceOf(Function);
  });

  it('should have all method', () => {
    expect(storage.all).toBeInstanceOf(Function);
  });

  it('should have count method', () => {
    expect(storage.count).toBeInstanceOf(Function);
  });

  it('should have db property', () => {
    expect(storage.db).toBeDefined();
    expect(storage.db).toBeInstanceOf(Sequelize);
  });

  it('should connect to the database successfully', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await storage.connect();
    expect(logSpy).toHaveBeenCalledWith('Connection has been established successfully.');
  });

  it('should return all products', async () => {
    const products = await storage.all(Product);
    const allProducts = await storage.all();
    expect(products).toHaveLength(2);
    expect(allProducts).toHaveLength(3);
  });

  it('should return the count of products', async () => {
    const count = await storage.count(Product);
    const allCount = await storage.count();
    expect(count).toBe(2);
    expect(allCount).toBe(3);
  });
});
