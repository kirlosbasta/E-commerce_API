const createApp = require('../../config/server');
const { storage, Category } = require('../../models/index');
const request = require('supertest');


describe('/api/v1/categories', () => {
  let app, category1, category2;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    category1 = await Category.create({ name: 'category1' });
    category2 = await Category.create({ name: 'category2' });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  describe('GET', () => {
    it('should GET all of the categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
    });

    it('should GET category by id', async () => {
      const res = await request(app).get('/api/v1/categories/' + category1.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', category1.id);
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app).get('/api/v1/categories/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Category not found' });
    });
  });

  describe('POST', () => {
    it('should fail if there is no name', async () => {
      const res = await request(app).post('/api/v1/categories').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing name' });
    });

    it('should create a new category', async () => {
      const res = await request(app).post('/api/v1/categories').send({ name: 'category3' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'category3');
    });

    it('should fail if category already exists', async () => {
      const res = await request(app).post('/api/v1/categories').send({ name: 'category3' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('Error', 'name must be unique');
    });

    it('should fail if name is empty', async () => {
      const res = await request(app).post('/api/v1/categories').send({ name: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('Error', 'Missing name');
    });

    it('should igonre id, createAt, updatedAt', async () => {
      const res = await request(app).post('/api/v1/categories').send({
        name: 'category4',
        id: '1234',
        createdAt: '2020-01',
        updatedAt: '2020-02'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'category4');
      expect(res.body).not.toHaveProperty('id', '1234');
      expect(res.body).not.toHaveProperty('createdAt', '2020-01');
      expect(res.body).not.toHaveProperty('updatedAt', '2020-02');
    });
  });

  describe('PUT', () => {
    it('should update a category', async () => {
      const res = await request(app).put('/api/v1/categories/' + category1.id).send({ name: 'category5' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'category5');
    });

    it('should fail if name is empty', async () => {
      const res = await request(app).put('/api/v1/categories/' + category1.id).send({ name: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('Error', 'Missing name');
    });

    it('should fail if category not found', async () => {
      const res = await request(app).put('/api/v1/categories/999').send({ name: 'category5' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Category not found' });
    });

    it('should ignore id, createAt, updatedAt', async () => {
      const res = await request(app).put('/api/v1/categories/' + category1.id).send({
        name: 'category6',
        id: '1234',
        createdAt: '2020-01',
        updatedAt: '2020-02'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'category6');
      expect(res.body).not.toHaveProperty('id', '1234');
      expect(res.body).not.toHaveProperty('createdAt', '2020-01');
      expect(res.body).not.toHaveProperty('updatedAt', '2020-02');
    });

    it('should fail if name already exists', async () => {
      const res = await request(app).put('/api/v1/categories/' + category1.id).send({ name: 'category2' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'name must be unique' });
    });
  });

  describe('DELETE', () => {
    it('should delete a category', async () => {
      const res = await request(app).delete('/api/v1/categories/' + category1.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'Category deleted' });
    });

    it('should fail if category not found', async () => {
      const res = await request(app).delete('/api/v1/categories/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Category not found' });
    });
  });
});