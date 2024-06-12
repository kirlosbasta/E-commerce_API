const createApp = require('../../config/server');
const { storage, Customer } = require('../../models/index');
const request = require('supertest');

describe('/api/v1/auth', () => {
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

  it('should fail if not email field is provided', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      username: 'fakeuser',
      password: 'fakepass'
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Bad Request');
  });

  it('should fail if not password field is provided', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'fakeuser',
      fake: 'fakepass'
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Bad Request');
  });

  it('should fail if email is not found', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'fakeuser',
      password: 'fakepass'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ Error: 'Customer not found' });
  });

  it('should fail if password is invalid', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: customer.email,
      password: 'fakepass'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ Error: 'Invalid Password' });
  });

  it('should login successfully', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: customer.email,
      password: 'password'
    });
    console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Login successful' });
  });
});
