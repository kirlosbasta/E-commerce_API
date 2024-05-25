import { Address, Customer, Order, OrderItem, Category, Product, storage } from './models/index.js'


(async () => {

  const product = await Product.findByPk('6f2873ec-c7d5-41ae-b51f-96cb7ee964cc');
  console.log(product.price * 3);
  // await storage.sync();
  // const customer = await Customer.create({
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'JohnDoe@gmail.com',
  //   password: 'password',
  //   phoneNumber: '+2345678901234',
  // });

  // await customer.createAddress({
  //   street: '123 Main Street',
  //   city: 'Lagos',
  //   state: 'Lagos',
  //   country: 'Nigeria',
  //   zipCode: 100001,
  //   houseNumber: '123',
  //   floor: 1,
  //   description: 'Home',
  // });
  // await customer.createAddress({
  //   street: '456 Broad Street',
  //   city: 'Lagos',
  //   state: 'Lagos',
  //   country: 'Nigeria',
  //   zipCode: 100001,
  //   houseNumber: '456',
  //   floor: 2,
  //   description: 'Office',
  // });

  // const iphones = await Product.bulkCreate([
  //   {
  //     name: 'Iphone 6s',
  //     description: 'A phone from Apple',
  //     price: 1000,
  //     stock: 10,
  //   },
  //   {
  //     name: 'Iphone 7s',
  //     description: 'A phone from Apple',
  //     price: 2000,
  //     stock: 20,
  //   },
  //   {
  //     name: 'Iphone 8s',
  //     description: 'A phone from Apple',
  //     price: 3000,
  //     stock: 30,
  //   },
  //   {
  //     name: 'Iphone 9s',
  //     description: 'A phone from Apple',
  //     price: 4000,
  //     stock: 40,
  //   },
  // ]);
  // const addresses = await customer.getAddresses();
  // const order = await customer.createOrder({
  //   status: 'pending',
  //   addressId: addresses[0].id,
  // });
  // const orderItems = await OrderItem.bulkCreate([
  //   {
  //     orderId: order.id,
  //     productId: iphones[0].id,
  //     quantity: 2,
  //     price: iphones[0].price,
  //   },
  //   {
  //     orderId: order.id,
  //     productId: iphones[1].id,
  //     quantity: 3,
  //     price: iphones[1].price,
  //   },
  // ]);
  // const categories = await Category.bulkCreate([
  //   {
  //     name: 'Electronics',
  //   },
  //   {
  //     name: 'Phones',
  //   },
  // ]);
  // await iphones[0].addCategories([categories[0], categories[1]]);
  // await iphones[1].addCategories([categories[0], categories[1]]);
  // console.log(await order.toJSON());
}) ();


// To do:-
//orderItem should have a method that calculate subtotal price
//order should have a method that calculate total price
//order should have a method that calculate total quantity



// Done:-
// order can have only one customer 
//customer can have multiple orders
//order can have only one address
//address can have multiple orders
//order can have multiple orderItems
//orderItem can have only one order
//orderItem can have only one product
//product can have multiple orderItems
//product can have multiple categories
//category can have multiple products
//order should have a status
//orderItem should have a quantity
//orderItem should have a price
