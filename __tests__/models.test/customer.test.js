const { Address, Customer, storage } = require( "../../models/index.js");

let customer;


describe("Test Customer", () => {
  beforeAll(async () => {
    await storage.sync();
    customer = await Customer.create(
      {
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@gmail.com",
        password: "password",
      });
      
  });
  afterAll(async () => {
    await storage.db.drop();
  });

  it('should have a customer', async () => {
    const json = customer.toJSON();
    expect(customer).toBeInstanceOf(Customer);
    expect(json).toHaveProperty('id', customer.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('firstName', 'John');
    expect(json).toHaveProperty('lastName', 'Doe');
    expect(json).toHaveProperty('email', 'JohnDoe@gmail.com');
    expect(json).not.toHaveProperty('password');
    expect(customer.password).not.toBe('password');
    expect(json).toHaveProperty('model', 'Customer');
  });

  it('should throw an eror if email is not valid', async () => {
    try {
      await Customer.create({
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe",
        password: "password",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Validation error: Email must be in the format example@exam.com');
    }
  });
});