# Marketer API

## Introduction
The Marketer API is the ultimate API solution for small businesses looking to take their business to the next level. With Marketer, you can seamlessly integrate powerful ecommerce tools into your existing systems, helping you attract new customers, boost sales, and grow your brand.

## Features
- <b>Customer manegment<b>: Create, update, and delete customers.
- <b>Authentication<b>: Easy to use authentication with passportjs.
- <b>Search<b>: Search for products by name, price or category. 
- <b>Security<b>: Secure your customers credentials.

## Getting Started
To get started with the Marketer API, you need first to have node and mysql installed on your machine. You can download node >= 18 from [here](https://nodejs.org/en/download/) and mysql from [here](https://dev.mysql.com/downloads/mysql/).

1.Clone the repository: `git clone https://github.com/kirlosbasta/E-commerce_API.git`.<br>
2.cd to the repo directory: `cd E-commerce_API`.<br>
3.Install the dependencies: `npm install`.<br>
4.Start the server: `npm run start`.<br>

## Environment Variables
The Marketer API uses environment variables to configure the server. You can set these variables in a `.env` file in the root directory of the project. Here are the available environment variables:

- `ECOMM_PORT`: The port on which the server will run. Default is `5000`.
- `ECOMM_MYSQL_USER`: The username of the MySQL database
- `ECOMM_MYSQL_PWD`: The password of the MySQL database
- `ECOMM_MYSQL_DATABASE`: The name of the MySQL database
- `ECOMM_MYSQL_HOST`: The host of the MySQL database.
- `ECOMM_SESSION_SECRET`: The secret key used to sign the session ID cookie.
- `ECOMM_ENV`: The environment in which the server is running.

## API Reference

The Marketer API provides the following endpoints(All endpoints are prefixed with `/api/v1`):

- `/auth/login`: 
    - `POST`: Authenticate a user.<br>
        `fields`: <br>
            `email` - string<br> 
            `password` - string.

- `/status`: 
    - `GET`: Get the status of the authentication.


- `/customers`: 
    - `GET`: Get a list of all customers.
    - `POST`: Create a new customer.<br>
        `fields`: <br>
            `firstName` - string<br>
            `lastName` - string<br>
            `email` - string<br> 
            `password` - string.


- `/customers/{id}`:
    - `GET`: Get a specific customer by ID.
    - `PUT`: Update a specific customer by ID.<br>
        `fields`: <br>
            `firstName` - string<br>
            `lastName` - string<br>
            `password` - string.
    - `DELETE`: Delete a specific customer by ID.


- `/addresses`:
    - `GET`: Get a list of all addressess of the authenticated user.
    - `POST`: Create a new address.<br>
        `fields`: <br>
            `street` - string<br>
            `city` - string<br>
            `state` - string<br>
            `zipCode` - int<br>
            `country` - string<br>
            `phoneNumber` - string.<br>
            `additionalPhoneNumber` - string<br>
            `houseNumber` - string<br>
            `floor` - int<br>
            `description` - string.

- `/addresses/{id}`:
    - `GET`: Get a specific address by ID.
    - `PUT`: Update a specific address by ID.<br>
        `fields`: <br>
            `street` - string<br>
            `city` - string<br>
            `state` - string<br>
            `zipCode` - int<br>
            `country` - string<br>
            `phoneNumber` - string.<br>
            `additionalPhoneNumber` - string<br>
            `houseNumber` - string<br>
            `floor` - int<br>
            `description` - string.
    - `DELETE`: Delete a specific address by ID.

- `/products`:
    - `GET`: Get a list of all products.
    - `POST`: Create a new product.<br>
        `fields`: <br>
            `name` - string<br>
            `price` - float<br>
            `description` - string<br>
            `stock` - int Default 0<br>

- `/products/{id}`:
    - `GET`: Get a specific product by ID.
    - `PUT`: Update a specific product by ID.<br>
        `fields`: <br>
            `name` - string<br>
            `price` - float<br>
            `description` - string<br>
            `stock` - int Default 0<br>
    - `DELETE`: Delete a specific product by ID.

- `/categories`:
    - `GET`: Get a list of all categories.
    - `POST`: Create a new category.<br>
        `fields`: <br>
            `name` - string<br>

- `/categories/{id}`:
    - `GET`: Get a specific category by ID.
    - `PUT`: Update a specific category by ID.<br>
        `fields`: <br>
            `name` - string<br>
    - `DELETE`: Delete a specific category by ID.

- `/orders`:
    - `GET`: Get a list of all orders of the customer.
    - `POST`: Create a new order.<br>
        `fields`: <br>
            `addressId` - string<br>
            `orderItems` - array of objects with the following fields:<br>
                `productId` - int<br>
                `quantity` - int.

- `/orders/{id}`:
    - `GET`: Get a specific order by ID.
    - `PUT`: Update a specific order by ID.<br>
        `fields`: <br>
            `status` - string<br>
    - `DELETE`: Set the status to canceled.

- `/orders/:orderId/address`: 
    - `GET`: Get the address of the order.

- `/orders/:orderId/orderItems`:
    - `GET`: Get the order items of the order.
    - `POST`: Add a new order item to the order.<br>
        `fields`: <br>
            `orderItems` - array of objects with the following fields:<br>
                `productId` - int<br>
                `quantity` - int.

- `/orders/:orderId/orderItems/{id}`:
    - `PUT`: Update a specific order item by ID.<br>
        `fields`: <br>
            `quantity` - int.
    - `DELETE`: Delete a specific order item by ID.


- `/products/:productId/categories`:
    - `GET`: Get the categories of the product.

- `/categories/:categoryId/products`:
    - `GET`: Get the products of the category.

- `/products/:productId/categories/:categoryId`:
    - `POST`: Add a category to the product.<br>
    - `DELETE`: Remove a category from the product.<br>


- `/product_search`:
    `POST`: Search for products by name, price or category.<br>
        `fields`: <br>
            `name` - string<br>
            `min` - float<br>
            `max` - float<br>
            `categories` - Array of categories id.



## Examples

```
$ curl -X POST http://localhost:5000/api/v1/auth/login\
    -d '"email": "JohnDoe@gmail.com", "password": "password"'\
    -H "Content-Type: application/json"
{
  "message": "Login successful"
}
```
```
$ curl -X GET http://localhost:5000/api/v1/status
{
  "status": "ok"
}
```
```
$ curl -X GET http://localhost:5000/api/v1/customers
[
    {
        "id": "190ec1f1-84f3-4672-8240-70a34bcb52c2",
        "firstName": "John",
        "lastName": "Doe",
        "email": "JohnDoe@gmail.com",
        "createdAt": "2024-06-12 20:02:43",
        "updatedAt": "2024-06-12 20:02:43",
        "model": "Customer"
    }
]
```
```
$ curl -X POST http://localhost:5000/api/v1/addresses\
    -H "Content-Type: application/json"\
    -d '{
        "street": "Elm Street",
        "city": "Springwood",
        "state": "Ohio",
        "zipCode": 12345,
        "country": "USA",
        "phoneNumber": "+1234567890",
        "additionalPhoneNumber": "+0987654321",
        "houseNumber": "123",
        "floor": 1,
        "description": "Home"
    }'
{
    "id": "780823c7-2769-4e35-b029-83b1f57f151e",
    "street": "Elm Street",
    "city": "Springwood",
    "state": "Ohio",
    "zipCode": 12345,
    "country": "USA",
    "phoneNumber": "+1234567890",
    "additionalPhoneNumber": "+0987654321",
    "houseNumber": "123",
    "floor": 1,
    "description": "Home",
    "createdAt": "2024-06-12 20:02:43",
    "updatedAt": "2024-06-12 20:02:43",
    "model": "Address",
}
```
```
$ curl -X POST http://localhost:5000/api/v1/products\
    -H "Content-Type: application/json"\
    -d '{
        "name": "Iphone 13",
        "price": 1000,
        "description": "The latest Iphone",
        "stock": 10
    }'
{
    "id": "5b9dbb42-d6cf-4268-ab22-e002dc5f3527",
    "name": "Iphone 13",
    "price": 1000,
    "description": "The latest Iphone",
    "stock": 10,
    "createdAt": "2024-06-12 20:02:43",
    "updatedAt": "2024-06-12 20:02:43",
    "model": "Product",
}
```
```
$ curl -X POST http://localhost:5000/api/v1/categories\
    -H "Content-Type: application/json"\
    -d '{
        "name": "Electronics"
    }'
{
    "id": "780823c7-2769-4e35-b029-83b1f57f151e",
    "name": "Electronics",
    "createdAt": "2024-06-12 20:02:43",
    "updatedAt": "2024-06-12 20:02:43",
    "model": "Category",
}
```
```
$ curl -X POST http://localhost:5000/api/v1/products/5b9dbb42-d6cf-4268-ab22-e002dc5f3527/categories/780823c7-2769-4e35-b029-83b1f57f151e
{}
```

```
$ curl -X POST http://localhost:5000/api/v1/orders\
    -H "Content-Type: application/json"\
    -d '{
        "addressId": "780823c7-2769-4e35-b029-83b1f57f151e",
        "orderItems": [
            {
                "productId": "5b9dbb42-d6cf-4268-ab22-e002dc5f3527",
                "quantity": 2
            }
        ]
    }'
{
    "id": "cda63200-e64d-4027-93b6-8ecb94101130",
    "status": "pending",
    "customerId": "190ec1f1-84f3-4672-8240-70a34bcb52c2",
    "addressId": "780823c7-2769-4e35-b029-83b1f57f151e",
    "updatedAt": "2024-06-13T02:22:59.250Z",
    "createdAt": "2024-06-13T02:22:59.250Z",
    "model": "Order",
    "totalPrice": 2000,
    "totalQuantity": 2
}
```
```
$ curl -X POST http://localhost:5000/api/v1/orders/cda63200-e64d-4027-93b6-8ecb94101130/orderItems\
    -H "Content-Type: application/json"\
    -d '{
        "orderItems": [
            {
                "productId": "5b9dbb42-d6cf-4268-ab22-e002dc5f3527",
                "quantity": 2
            }
        ]
    }'
[
    {
    "subTotal": 2000,
    "id": "c39ea2ff-d5e5-4fe8-9b4d-6ea59b350a6a",
    "quantity": 2,
    "price": 1000,
    "createdAt": "2024-06-13T00:38:39.000Z",
    "updatedAt": "2024-06-13T02:47:38.000Z",
    "orderId": "d3beeea5-3f4a-498a-8a2d-9d12599748f4",
    "productId": "5b9dbb42-d6cf-4268-ab22-e002dc5f3527",
    "model": "OrderItem"
  }
]
```
```
$ curl -X POST http://localhost:5000/api/v1/product_search\
    -H "Content-Type: application/json"\
    -d '{
        "name": "Iphone",
        "min": 1000,
        "max": 2000,
        "categories": ["780823c7-2769-4e35-b029-83b1f57f151e"]
    }'
{
    "products": [
        {
            "id": "5b9dbb42-d6cf-4268-ab22-e002dc5f3527",
            "name": "Iphone 13",
            "price": 1000,
            "description": "The latest Iphone",
            "stock": 10,
            "createdAt": "2024-06-12 20:02:43",
            "updatedAt": "2024-06-12 20:02:43",
            "model": "Product",
        }
    ]
}
```
```
$ curl -X GET http://localhost:5000/api/v1/products/5b9dbb42-d6cf-4268-ab22-e002dc5f3527/categories
{
    "categories": [
        {
            "id": "780823c7-2769-4e35-b029-83b1f57f151e",
            "name": "Electronics",
            "createdAt": "2024-06-12 20:02:43",
            "updatedAt": "2024-06-12 20:02:43",
            "model": "Category",
        }
    ]
}
```

## Contributing
We welcome contributions from the community! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on our [GitHub repository](https://github.com/kirlosbasta/E-commerce_API).

## Contact
If you have any questions or need further assistance, you can reach me at:
[LinkedIn](https://www.linkedin.com/in/kirlos-basta/)<br>
[Twitter](https://twitter.com/KirlosBasta12)<br>
