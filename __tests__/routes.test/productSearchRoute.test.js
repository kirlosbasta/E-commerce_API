const createApp = require('../../config/server');
const { storage, Product, Category } = require('../../models/index');
const request = require('supertest');


describe('Test categoryProductLinkRoute', () => {
  let app, product1, product2, product3, product4, product5, category1, category2, category3;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();

    product1 = await Product.create({ name: 'iphone 5s', price: 100, stock: 10, description: 'product1'});
    product2 = await Product.create({ name: 'iphone 5', price: 50, stock: 20, description: 'product2'});
    product3 = await Product.create({ name: 'iphone 6', price: 200, stock: 30, description: 'product3'});
    product4 = await Product.create({ name: 'ipad 2', price: 300, stock: 40, description: 'product4'});
    product5 = await Product.create({ name: 'samsung 24s', price: 400, stock: 50, description: 'product5'});
    category1 = await Category.create({ name: 'iphones' });
    category2 = await Category.create({ name: 'phones' });
    category3 = await Category.create({ name: 'apple' });

    category2.addProducts([product1, product2, product3, product4, product5]);
    category1.addProducts([product1, product2, product3]);
    category3.addProducts([product1, product3, product2, product4]);
  });

  afterAll(async () => {
    await storage.db.drop();
  });


  it('should search for products by name', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'iphone' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('stock');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('model', 'Product');
  });

  it('should search for products by price range', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ min: 100, max: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('stock');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('model', 'Product');
  });

  it('should search for products by category', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ categories: [category1.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('stock');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('model', 'Product');
  });

  it('should search for products by name, price range and category', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'iphone', min: 100, max: 200, categories: [category1.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(2);
  });

  it('should return an empty array if no products are found', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'samsung', min: 100, max: 200, categories: [category1.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(0);
  });

  it('should search for products by min price', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ min: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });

  it('should search for products by max price', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ max: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });

  it('should return all products if no search parameters are provided', async () => {
    const res = await request(app).post('/api/v1/product_search').send({});
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(5);
  });

  it('should search with name and price', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'iphone', min: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(2);
  });

  it('should search with price and category', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ min: 100, categories: [category1.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(2);
  });

  it('should search with name and category', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'iphone', categories: [category1.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });

  it('should search case insensitive', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ name: 'IPHONE' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });

  it('should search with categories excluding products', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ categories: [category1.id, category2.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });

  it('should search with categories excluding products', async () => {
    const res = await request(app).post('/api/v1/product_search').send({ categories: [category1.id, category2.id, category3.id] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });
});
