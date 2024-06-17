const createApp = require('../../config/server');
const { storage, Customer } = require('../../models/index');
const request = require('supertest');

describe('/api/v1/addresses', () => {
  let app, customer, address1, address2, cookie;

  beforeAll(async () => {
    await storage.sync();
    app = createApp();
    customer = await Customer.create({
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
    address2 = await customer.createAddress({
      street: '14 waffle St',
      city: 'yorkshire',
      state: 'NW',
      zipCode: 346243,
      country: 'RU',
      phoneNumber: '+1234567890'
    });
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: customer.email,
        password: 'password'
      });
    cookie = login.headers['set-cookie'];
  });
  afterAll(async () => {
    await storage.db.drop();
  });

  it('should fail if not authenticated', async () => {
    const res = await request(app).get('/api/v1/addresses');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ Error: 'Unauthenticated' });
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
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', address1.id);
    });

    it('should fail if address does not exist', async () => {
      const res = await request(app)
        .get('/api/v1/addresses/100')
        .set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Address not found' });
    });
  });

  describe('POST', () => {
    it('should create a new address', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
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
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('street', '123 Main St');      
    });

    it('should fail if missing street fields', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
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
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing street' });
    });

    it('should fail if missing city fields', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          state: 'IL',
          zipCode: 62701,
          country: 'USA',
          houseNumber: '32',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing city' });
    });

    it('should fail if missing state fields', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          city: 'Springfield',
          zipCode: 62701,
          country: 'USA',
          houseNumber: '32',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing state' });
    });

    it('should fail if missing zipCode fields', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          houseNumber: '32',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing zipCode' });
    });

    it('should fail if missing country fields', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          houseNumber: '32',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing country' });
    });

    it('should fail if missing phoneNumber field', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'USA',
          houseNumber: '32',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Missing phoneNumber' });
    });


    it('should fail if phone number is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/addresses')
        .set('Cookie', cookie)
        .send({
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'USA',
          houseNumber: '32',
          phoneNumber: '1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Phone number must be in the format +1234567890' });
    });
  });

  describe('PUT', () => {
    it('should update an address', async () => {
      const res = await request(app)
        .put(`/api/v1/addresses/${address1.id}`)
        .set('Cookie', cookie)
        .send({
          street: '25 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'CA',
          houseNumber: '35',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a different description'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('street', '25 Main St');
        expect(res.body).toHaveProperty('country', 'CA');
        expect(res.body).toHaveProperty('description', 'This is a different description');
        expect(res.body).toHaveProperty('houseNumber', '35');
        expect(res.body).toHaveProperty('id', address1.id);
    });

    it('should fail if address does not exist', async () => {
      const res = await request(app)
        .put('/api/v1/addresses/100')
        .set('Cookie', cookie)
        .send({
          street: '25 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'CA',
          houseNumber: '35',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a different description'
        });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Address not found' });
    });

    it('should skip id, createdAt, updatedAt and customerId', async () => {
      const res = await request(app)
        .put(`/api/v1/addresses/${address1.id}`)
        .set('Cookie', cookie)
        .send({
          id: '100',
          createdAt: '2020-01-01',
          updatedAt: '2020-01-01',
          customerId: '100',
          street: '25 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'CA',
          houseNumber: '35',
          phoneNumber: '+1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a different description'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', address1.id);
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
      expect(res.body).toHaveProperty('customerId', customer.id);
    });

    it('should fail if the data is invalid', async () => {
      const res = await request(app)
        .put(`/api/v1/addresses/${address1.id}`)
        .set('Cookie', cookie)
        .send({
          street: '25 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: 62701,
          country: 'CA',
          houseNumber: '35',
          phoneNumber: '1234567890',
          additionalPhoneNumber: '+2839483948',
          floor: 5,
          description: 'This is a different description'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ Error: 'Phone number must be in the format +1234567890' });
    });
  });

  describe('DELETE', () => {
    it('should delete an address', async () => {
      const res = await request(app)
        .delete(`/api/v1/addresses/${address1.id}`)
        .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ Success: 'Address deleted' });
    });

    it('should fail if address does not exist', async () => {
      const res = await request(app)
        .delete('/api/v1/addresses/100')
        .set('Cookie', cookie);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ Error: 'Address not found' });
    });
  });
});
