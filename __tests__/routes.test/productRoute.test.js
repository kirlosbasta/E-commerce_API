const createApp = require('../../config/server');
const { storage, Product } = require('../../models/index');
const request = require('supertest');


describe('/api/v1/products', () => {
  let app, product1, product2;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    product1 = await Product.create({ name: 'product1', price: 10, stock: 10, description: 'product1'});
    product2 = await Product.create({ name: 'product2', price: 20, stock: 20, description: 'product2'});
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  describe('GET', () => {
    it('should GET all of the products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
    });

    it('should GET product by id', async () => {
      const res = await request(app).get('/api/v1/products/' + product1.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', product1.id);
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app).get('/api/v1/products/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Product not found' });
    });
  });

  describe('POST', () => {
    it('should fail if there is no name', async () => {
      const res = await request(app).post('/api/v1/products').send({price: 30});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing name' });
    });

    it('should fail if there is no price', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product3' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing price' });
    });

    it('should create a new product', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product3', price: 30 });
      console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'product3');
      expect(res.body).toHaveProperty('price', 30);
      expect(res.body).toHaveProperty('stock', 0);
      expect(res.body).not.toHaveProperty('description');
      expect(res.body).toHaveProperty('model', 'Product');
    });

    it('should fail if price is not a number', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product4', price: 'price' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Price must be a number' });
    });

    it('should fail if price is less than 0', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product4', price: -1 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Price must be greater than 0' });
    });

    it('should fail if stock is not an integer', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product4', price: 40, stock: 'stock' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Stock must be an integer' });
    });

    it('should fail if stock is less than 0', async () => {
      const res = await request(app).post('/api/v1/products').send({ name: 'product4', price: 40, stock: -1 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Stock must be greater than or equal to 0' });
    });

    it('should ignore id, createdAt, updatedAt', async () => {
      const res = await request(app).post('/api/v1/products').send({
        name: 'product4',
        price: 40,
        stock: 40,
        description: 'product4',
        id: '1234',
        createdAt: '2020-01',
        updatedAt: '2020-02'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'product4');
      expect(res.body).not.toHaveProperty('id', '1234');
      expect(res.body).not.toHaveProperty('createdAt', '2020-01');
      expect(res.body).not.toHaveProperty('updatedAt', '2020-02');
    });
  });

  describe('PUT', () => {
    it('should update a product', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({ name: 'product5' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'product5');
    });

    it('should fail if product not found', async () => {
      const res = await request(app).put('/api/v1/products/999').send({ name: 'product5' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Product not found' });
    });

    it('should ignore id, createAt, updatedAt', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({
        name: 'product5',
        id: '1234',
        createdAt: '2020-01',
        updatedAt: '2020-02'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'product5');
      expect(res.body).not.toHaveProperty('id', '1234');
      expect(res.body).not.toHaveProperty('createdAt', '2020-01');
      expect(res.body).not.toHaveProperty('updatedAt', '2020-02');
    });

    it('should fail if price is not an number', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({ price: 'price' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Price must be a number' });
    });

    it('should fail if price is less than 0', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({ price: -1 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Price must be greater than 0' });
    });

    it('should fail if stock is not an integer', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({ stock: 'stock' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Stock must be an integer' });
    });

    it('should fail if stock is less than 0', async () => {
      const res = await request(app).put('/api/v1/products/' + product1.id).send({ stock: -1 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Stock must be greater than or equal to 0' });
    });
  });

  describe('DELETE', () => {
    it('should delete a product', async () => {
      const res = await request(app).delete('/api/v1/products/' + product1.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'Product deleted' });
    });

    it('should fail if product not found', async () => {
      const res = await request(app).delete('/api/v1/products/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Product not found' });
    });
  });
});
