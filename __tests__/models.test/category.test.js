const { Category, storage } = require('../../models/index.js');

let category;

describe('Test Category', () => {
  beforeAll(async () => {
    await storage.sync();
  });

  afterAll(async () => {
    await storage.db.drop();
  });

  it('should create a category', async () => {
    category = await Category.create({
      name: 'Electronics'
    });
    const json = category.toJSON();
    expect(category).toBeInstanceOf(Category);
    expect(json).toHaveProperty('id', category.id);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    expect(json).toHaveProperty('name', 'Electronics');
    expect(json).toHaveProperty('model', 'Category');
  });

  it('should not create a category without a name', async () => {
    try {
      await Category.create({
        description: 'All electronics'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have a unique name', async () => {
    try {
      await Category.create({
        name: 'Electronics'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should have getProducts method', async () => {
    expect(category.getProducts).toBeInstanceOf(Function);
  });

  it('should have countProducts method', async () => {
    expect(category.countProducts).toBeInstanceOf(Function);
  });

  it('should have hasProduct method', async () => {
    expect(category.hasProduct).toBeInstanceOf(Function);
  });

  it('should have hasProducts method', async () => {
    expect(category.hasProducts).toBeInstanceOf(Function);
  });

  it('should have setProducts method', async () => {
    expect(category.setProducts).toBeInstanceOf(Function);
  });

  it('should have addProducts method', async () => {
    expect(category.addProducts).toBeInstanceOf(Function);
  });

  it('should have addProduct method', async () => {
    expect(category.addProduct).toBeInstanceOf(Function);
  });

  it('should have removeProduct method', async () => {
    expect(category.removeProduct).toBeInstanceOf(Function);
  });

  it('should have removeProducts method', async () => {
    expect(category.removeProducts).toBeInstanceOf(Function);
  });

  it('should have createProduct method', async () => {
    expect(category.createProduct).toBeInstanceOf(Function);
  });
});
