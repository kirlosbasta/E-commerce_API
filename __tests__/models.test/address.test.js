const { Address, Customer, storage } = require('../../models/index.js');

let customer, address1, address2;

describe('Test Address', () => {
  beforeAll(async () => {
    await storage.sync();
    customer = await Customer.create(
      {
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
  });
  afterAll(async () => {
    await storage.db.drop();
  });
  it('should have an address1', () => {
    const json = address1.toJSON();
    expect(address1).toBeInstanceOf(Address);
    expect(json).toHaveProperty('id', address1.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('street', '123 Main St');
    expect(json).toHaveProperty('city', 'Springfield');
    expect(json).toHaveProperty('state', 'IL');
    expect(json).toHaveProperty('zipCode', 62701);
    expect(json).toHaveProperty('country', 'USA');
    expect(json).toHaveProperty('houseNumber', '32');
    expect(json).toHaveProperty('phoneNumber', '+1234567890');
    expect(json).toHaveProperty('floor', 5);
    expect(json).toHaveProperty('description', 'This is a description');
    expect(json).toHaveProperty('additionalPhoneNumber', '+2839483948');
    expect(json).toHaveProperty('model', 'Address');
  });

  it('should have an address2', () => {
    const json = address2.toJSON();
    expect(address2).toBeInstanceOf(Address);
    expect(json).toHaveProperty('id', address2.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('street', '14 waffle St');
    expect(json).toHaveProperty('city', 'yorkshire');
    expect(json).toHaveProperty('state', 'NW');
    expect(json).toHaveProperty('zipCode', 346243);
    expect(json).toHaveProperty('country', 'RU');
    expect(json).not.toHaveProperty('houseNumber');
    expect(json).toHaveProperty('phoneNumber', '+1234567890');
    expect(json).not.toHaveProperty('floor');
    expect(json).not.toHaveProperty('description');
    expect(json).not.toHaveProperty('additionalPhoneNumber');
    expect(json).toHaveProperty('model', 'Address');
  });

  it('should fail with Phone number must be in the format +1234567890', async () => {
    try {
      const wrongNumber = await customer.createAddress({
        street: '14 waffle St',
        city: 'yorkshire',
        state: 'NW',
        zipCode: 346243,
        country: 'RU',
        phoneNumber: '12df34567890'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Validation error: Phone number must be in the format +1234567890');
    }
  });

  it('should fail for additional phone number with Phone number must be in the format +1234567890', async () => {
    try {
      const wrongNumber = await customer.createAddress({
        street: '14 waffle St',
        city: 'yorkshire',
        state: 'NW',
        zipCode: 346243,
        country: 'RU',
        phoneNumber: '+112358945',
        additionalPhoneNumber: 'jfvdfdfe'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Validation error: Phone number must be in the format +1234567890');
    }
  });

  it('should delete all addresses', async () => {
    await customer.destroy();
    const addresses = await Address.findAll();
    expect(addresses).toEqual([]);
  });
});
