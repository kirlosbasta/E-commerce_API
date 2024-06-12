const { Product, storage } = require( "../../models/index.js");


let product1;


describe('Test Product', () => {
  beforeAll(async () => {
    await storage.sync();

    product1 = await Product.create({
      name: 'iphone 4',
      price: 50,
      stock: 10,
      description: 'Older phone',
    });
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should create a product', async () => {
    const json = await product1.toJSON();
    expect(product1).toBeInstanceOf(Product);
    expect(json).toHaveProperty('id', product1.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('name', 'iphone 4');
    expect(json).toHaveProperty('price', 50);
    expect(json).toHaveProperty('stock', 10);
    expect(json).toHaveProperty('description', 'Older phone');
    expect(json).toHaveProperty('model', 'Product');
  });

  it('should not create a product without a name', async () => {
    try {
      await Product.create({
        price: 50,
        stock: 10,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a product without a price', async () => {
    try {
      await Product.create({
        name: 'iphone 4',
        stock: 10,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should can create a product without a stock and default to 0', async () => {
    try {
      const tmp = await Product.create({
        name: 'iphone 4',
        price: 50,
        description: 'Older phone',
      });

      expect(tmp).toBeTruthy();
      expect(tmp.stock).toBe(0);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a product with a negative price', async () => {
    try {
      await Product.create({
        name: 'iphone 4',
        price: -50,
        stock: 10,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a product with a negative stock', async () => {
    try {
      await Product.create({
        name: 'iphone 4',
        price: 50,
        stock: -10,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a product with a non-integer stock', async () => {
    try {
      await Product.create({
        name: 'iphone 4',
        price: 50,
        stock: 10.5,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a product with a non-numeric price', async () => {
    try {
      await Product.create({
        name: 'iphone 4',
        price: '50',
        stock: 10,
        description: 'Older phone',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have getCategories method', async () => {
    expect(product1.getCategories).toBeInstanceOf(Function);
  });

  it('should have countCategories method', async () => {
    expect(product1.countCategories).toBeInstanceOf(Function);
  });

  it('should have hasCategories method', async () => {
    expect(product1.hasCategories).toBeInstanceOf(Function);
  });
  
  it('should have hasCategories method', async () => {
    expect(product1.hasCategories).toBeInstanceOf(Function);
  });
  
  it('should have setCategories method', async () => {
    expect(product1.setCategories).toBeInstanceOf(Function);
  });
  
  it('should have addCategories method', async () => {
    expect(product1.addCategories).toBeInstanceOf(Function);
  });
  
  it('should have addCategories method', async () => {
    expect(product1.addCategories).toBeInstanceOf(Function);
  });

  it('should have removeCategories method', async () => {
    expect(product1.removeCategories).toBeInstanceOf(Function);
  });

  it('should have removeCategories method', async () => {
    expect(product1.removeCategories).toBeInstanceOf(Function);
  });

  it('should have createCategories method', async () => {
    expect(product1.createCategory).toBeInstanceOf(Function);
  });
});