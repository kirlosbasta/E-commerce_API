const { validataCustomer, validateAddress,
        validateProduct, validateCategory,
        validateOrder, validateOrderItem } = require('../../utils/routeValidation.js');
const { Customer, Address, Product, Category, Order, OrderItem, storage } = require('../../models/index.js');


describe('Test Route Validation', () => {

  const req = { params: { 
    customerId: 1,
    addressId: 1,
    productId: 1,
    categoryId: 1,
    orderId: 1,
    orderItemId: 1
   } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeAll(async () => {
    await storage.sync();
  });
  afterAll(async () => {
    await storage.db.drop();
  });

  describe('Test validataCustomer', () => {
    it('should validate a customer exists', async () => {
      Customer.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      await validataCustomer(req, res, next);
      expect(Customer.findByPk).toHaveBeenCalledWith(1);
      expect(req.customer).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });
  
    it('should return an error if a customer does not exist', async () => {
      Customer.findByPk = jest.fn().mockResolvedValue(null);
      await validataCustomer(req, res, next);
      expect(Customer.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Customer not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Test validateAddress', () => {
    it('should validate an address exists', async () => {
      Address.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      await validateAddress(req, res, next);
      expect(Address.findByPk).toHaveBeenCalledWith(1);
      expect(req.address).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });
  
    it('should return an error if an address does not exist', async () => {
      Address.findByPk = jest.fn().mockResolvedValue(null);
      await validateAddress(req, res, next);
      expect(Address.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Address not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Test validateProduct', () => {
    it('should validate a Product exists', async () => {
      Product.findByPk = jest.fn().mockResolvedValue({id: 1});
      await validateProduct(req, res, next);
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(req.product).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });

    it('should return an error if a product does not exists', async () => {
      Product.findByPk = jest.fn().mockResolvedValue(null);
      await validateProduct(req, res, next);
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ Error: 'Product not found' });
    });
  });

  describe('Test validateCategory', () => {
    it('should validate a category exists', async () => {
      Category.findByPk = jest.fn().mockResolvedValue({ id: 1});
      await validateCategory(req, res, next);
      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(req.category).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });

    it('should return an error if a category does not exists', async () => {
      Category.findByPk = jest.fn().mockResolvedValue(null);
      await validateCategory(req, res, next);
      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ Error: 'Category not found' });
    });
  });

  describe('Test validateOrder', () => {
    it('should validate a order exists', async () => {
      Order.findByPk = jest.fn().mockResolvedValue({ id: 1});
      await validateOrder(req, res, next);
      expect(Order.findByPk).toHaveBeenCalledWith(1);
      expect(req.order).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });

    it('should return an error if a Order does not exists', async () => {
      Order.findByPk = jest.fn().mockResolvedValue(null);
      await validateOrder(req, res, next);
      expect(Order.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ Error: 'Order not found' });
    });
  });

  describe('Test validateOrderItem', () => {
    it('should validate a orderItem exists', async () => {
      OrderItem.findByPk = jest.fn().mockResolvedValue({ id: 1});
      await validateOrderItem(req, res, next);
      expect(OrderItem.findByPk).toHaveBeenCalledWith(1);
      expect(req.orderItem).toEqual({ id: 1 });
      expect(next).toHaveBeenCalled();
    });

    it('should return an error if a Order does not exists', async () => {
      OrderItem.findByPk = jest.fn().mockResolvedValue(null);
      await validateOrderItem(req, res, next);
      expect(OrderItem.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ Error: 'OrderItem not found' });
    });
  });
});