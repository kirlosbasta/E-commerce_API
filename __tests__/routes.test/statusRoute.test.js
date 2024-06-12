const createApp = require('../../config/server');
const { storage, Customer } = require('../../models/index');
const request = require('supertest');

describe('/api/v1/status', () => {
  let app, customer;
  
  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    customer = await Customer.create({
      firstName: "John",
      lastName: "Doe",
      email: "JohnDoe@gmail.com",
      password: "password",
    });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should fail if not authenticated', async () => {
    const res = await request(app).get('/api/v1/status');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({Error: 'Unauthenticated'});
  });

  it('should return status ok', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: customer.email,
        password: "password"
      });
    const res = await request(app).get('/api/v1/status').set('Cookie', login.headers['set-cookie']);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({status: 'ok'});
  });
});