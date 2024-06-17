const createApp = require('../../config/server');
const { storage, Product, Category } = require('../../models/index');
const request = require('supertest');


describe('Test categoryProductLinkRoute', () => {
  let app, product1, product2, category1, category2;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    product1 = await Product.create({ name: 'product1', price: 10, stock: 10, description: 'product1'});
    product2 = await Product.create({ name: 'product2', price: 20, stock: 20, description: 'product2'});
    category1 = await Category.create({ name: 'category1' });
    category2 = await Category.create({ name: 'category2' });

    product1.addCategory(category1);
    product2.addCategory(category2);
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should get all categories for a product', async () => {
    const res = await request(app).get(`/api/v1/products/${product1.id}/categories`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'category1');
  });

  it('should fail if product is not found', async () => {
    const res = await request(app).get('/api/v1/products/999/categories');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Product not found' });
  });

  it('should get all products for a category', async () => {
    const res = await request(app).get(`/api/v1/categories/${category2.id}/products`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'product2');
  });

  it('should fail if category is not found', async () => {
    const res = await request(app).get('/api/v1/categories/999/products');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Category not found' });
  });

  it('should link a category to a product', async () => {
    const res = await request(app).post(`/api/v1/products/${product1.id}/categories/${category2.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({});
  });

  it('should return 200 if category is already linked to product', async () => {
    const res = await request(app).post(`/api/v1/products/${product1.id}/categories/${category1.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'category1');
  });

  it('should fail if product is not found', async () => {
    const res = await request(app).post('/api/v1/products/999/categories/1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Product not found' });
  });

  it('should fail if category is not found', async () => {
    const res = await request(app).post(`/api/v1/products/${product1.id}/categories/999`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Category not found' });
  });

  it('should unlink a category from a product', async () => {
    const res = await request(app).delete(`/api/v1/products/${product1.id}/categories/${category1.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });

  it('should fail if category is not linked to product', async () => {
    const category3 = await Category.create({ name: 'category3' });
    const res = await request(app).delete(`/api/v1/products/${product1.id}/categories/${category3.id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Category not linked to product' });
  });

  it('should fail if product is not found', async () => {
    const res = await request(app).delete('/api/v1/products/999/categories/1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Product not found' });
  });

  it('should fail if category is not found', async () => {
    const res = await request(app).delete(`/api/v1/products/${product1.id}/categories/999`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Category not found' });
  });
});
