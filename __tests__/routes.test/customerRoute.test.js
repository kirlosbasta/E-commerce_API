const passport = require('passport');
const createApp = require('../../config/server');
const { storage, Customer } = require('../../models/index');
const request = require('supertest');

describe('/api/v1/customers', () => {
  let app, customer;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    customer = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'JohnDoe@gmail.com',
      password: 'password'
    });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  describe('GET', () => {
    it('should GET all customers', async () => {
      const res = await request(app).get('/api/v1/customers');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(customer.id);
    });

    it('should GET a customer by id', async () => {
      const res = await request(app).get(`/api/v1/customers/${customer.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(customer.id);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail if id is not found', async () => {
      const res = await request(app).get('/api/v1/customers/34');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Customer not found' });
    });
  });

  describe('POST', () => {
    it('should fail if there is no firstName', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        lastName: 'Doe',
        email: 'JohnDoe@gmail.com',
        password: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing firstName' });
    });

    it('should fail if there is no lastName', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'Doe',
        email: 'JohnDoe@gmail.com',
        password: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing lastName' });
    });

    it('should fail if there is no email', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'Doe',
        lastName: 'JohnDoe@gmail.com',
        password: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing email' });
    });

    it('should fail if there is no password', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'Doe',
        email: 'JohnDoe@gmail.com',
        lastName: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing password' });
    });

    it('should fail is the email exists', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'JohnDoe@gmail.com',
        password: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'email must be unique' });
    });

    it('should succeed', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'Micheal',
        lastName: 'Reev',
        email: 'mikereeve@gmail.com',
        password: 'password'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('email', 'mikereeve@gmail.com');
      expect(res.body).toHaveProperty('firstName', 'Micheal');
      expect(res.body).toHaveProperty('lastName', 'Reev');
    });

    it('should throw an error if email is not a valid email', async () => {
      const res = await request(app).post('/api/v1/customers').send({
        firstName: 'Micheal',
        lastName: 'Reev',
        email: 'mikereeve',
        password: 'password'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Email must be in the format example@exam.com' });
    });
  });

  describe('PUT', () => {
    it('should update a customer', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .send({
          firstName: 'Updated',
          lastName: 'Customer',
          email: 'JohnDoe@gmail.com',
          password: 'newpassword'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('firstName', 'Updated');
      expect(res.body).toHaveProperty('lastName', 'Customer');
      expect(res.body).toHaveProperty('email', 'JohnDoe@gmail.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail if customer id is not found', async () => {
      const res = await request(app)
        .put('/api/v1/customers/999')
        .send({
          firstName: 'Updated',
          lastName: 'Customer',
          email: 'updatedcustomer@gmail.com',
          password: 'newpassword'
        });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Customer not found' });
    });

    it('should ignore id, createdAt, updatedAt and email', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/${customer.id}`)
        .send({
          firstName: 'Updated',
          lastName: 'Customer',
          email: 'updatedcustomer@gmail.com',
          password: 'newpassword',
          id: 'dufhdfudfads',
          createdAt: '1938103',
          updatedAt: '34739843'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('firstName', 'Updated');
      expect(res.body).toHaveProperty('lastName', 'Customer');
      expect(res.body).toHaveProperty('email', 'JohnDoe@gmail.com');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('id', 'dufhdfudfads');
      expect(res.body).not.toHaveProperty('createdAt', '1938103');
      expect(res.body).not.toHaveProperty('updatedAt', '34739843');
    });
  });

  describe('DELETE', () => {
    it('should delete a customer', async () => {
      const res = await request(app).delete(`/api/v1/customers/${customer.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'Customer deleted' });
    });

    it('should fail if customer id is not found', async () => {
      const res = await request(app).delete('/api/v1/customers/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Customer not found' });
    });
  });
});
