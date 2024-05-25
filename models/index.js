import Address from './address.js';
import Customer from './customer.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Product from './product.js';
import Category from './category.js';
export { default as Address } from './address.js';
export { default as Customer } from './customer.js';
export { default as Order } from './order.js';
export { default as OrderItem } from './orderItem.js';
export { default as Product } from './product.js';
export { default as Category } from './category.js';
import { storage } from '../config/database.js';
export { storage } from '../config/database.js';


(async () => {
  // create a one to many relationship between the customer and address and sync the database directly
  // when a customer is deleted, all associated addresses are deleted as well
  Customer.hasMany(Address, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Address.belongsTo(Customer, {
    foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
  });

  // create a one to many relationship between the customer and order and sync the database directly
  // when a customer is deleted, all associated orders are deleted as well
  Customer.hasMany(Order, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Order.belongsTo(Customer, {
    foreignKey: {
    allowNull: false,
    },
    onDelete: 'CASCADE',
  });

  // create one to many relationship between the address and order and sync the database directly
  Address.hasMany(Order, {
    foreignKey: {
      allowNull: false,
    },
  });
  Order.belongsTo(Address, {
    foreignKey: {
    allowNull: false,
    },
  });

  // create a one to many relationship between the order and orderItem and sync the database directly
  // when an order is deleted, all associated orderItems are deleted as well
  Order.hasMany(OrderItem, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: {
    allowNull: false,
    },
    onDelete: 'CASCADE',
  });

  // create a one to many relationship between the product and orderItem and sync the database directly
  // when a product is deleted, all associated orderItems are deleted as well
  Product.hasMany(OrderItem, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });

  OrderItem.belongsTo(Product, {
    foreignKey: {
    allowNull: false,
    },
  });

  // create a many to many relationship between the product and category and sync the database directly
  Product.belongsToMany(Category, { through: 'productCategory', timestamps: false});
  Category.belongsToMany(Product, { through: 'productCategory', timestamps: false});

  await storage.sync();
  // await Product.sync({ alter: true });
})();

