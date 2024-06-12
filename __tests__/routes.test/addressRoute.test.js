const createApp = require('../../config/server');
const { storage, Customer } = require('../../models/index');
const isAuthenticated = require('../../utils/middelware');
const request = require('supertest');


describe('/api/v1/addresses', () => {
  
  let app, customer, address1, address2, cookie;
  
  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    customer = await Customer.create({
      firstName: "John",
      lastName: "Doe",
      email: "JohnDoe@gmail.com",
      password: "password",
    });
    address1 = await customer.createAddress({
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: 62701,
      country: 'USA',
      houseNumber: '32',
      phoneNumber: "+1234567890",
      additionalPhoneNumber: "+2839483948",
      floor: 5,
      description: "This is a description",
    });
    address2 = await customer.createAddress({
      street: "14 waffle St",
      city: "yorkshire",
      state: "NW",
      zipCode: 346243,
      country: 'RU',
      phoneNumber: "+1234567890",
    });
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: customer.email,
        password: "password"
      });
    cookie = login.headers['set-cookie'];
  });
  afterAll(async () => {
    await storage.db.drop();
  });

  it('should fail if not authenticated', async () => {
    const res = await request(app).get('/api/v1/addresses');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({Error: 'Unauthenticated'});
  });

  describe('GET', () => {
    it('should GET all addresses', async () => {
      const res = await request(app).get('/api/v1/addresses').set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
    });

    it('should get address by id', async () => {
      const res = await request(app)
      .get(`/api/v1/addresses/${address1.id}`)
      .set('Cookie', cookie);
      console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', address1.id);
    });

    it('should fail if address does not exist', async () => {
      const res = await request(app)
      .get('/api/v1/addresses/100')
      .set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({Error: 'Address not found'});
    });
  });
});