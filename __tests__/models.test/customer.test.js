import { Address, Customer } from "../../models/index.js";

let customer;

describe("Customer", () => {
  beforeAll(async () => {
    customer = await Customer.create(
      {
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@gmail.com",
        password: "password",
        phoneNumber: "+1234567890",
      });
      await customer.createAddress({
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zipCode: 62701,
        country: 'USA',
        houseNumber: '32',
      });
      await customer.createAddress({
        street: "14 waffle St",
        city: "yorkshire",
        state: "NW",
        zipCode: 346243,
        country: 'RU',
        houseNumber: '32',
        floor: 5,
        description: "This is a description",
      });
  });
  afterAll(async () => {
    await Customer.destroy({ where: {email: 'JohnDoe@gmail.com'} });
  });

  test('should have a customer', async () => {
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.toJSON()).toHaveProperty('id', customer.id);
    expect(customer.toJSON()).toHaveProperty('createdAt');
  });
});