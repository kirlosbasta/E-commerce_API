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

The Marketer API provides the following endpoints:
- `auth/login`: 
    - `POST`: Authenticate a user.
        `fields`: `email` - string, `password` - string.
- `/api/v1/customers`: 
    - `GET`: Get a list of all customers.
    - `POST`: Create a new customer.

- `/api/v1/customers/{id}`:
    - `GET`: Get a specific customer by ID.
    - `PUT`: Update a specific customer by ID.
    - `DELETE`: Delete a specific customer by ID.
- `/api/v1/products`:
    - `GET`: Get a list of all products.
    - `POST`: Create a new product.
- `/api/v1/products/{id}`:
    - `GET`: Get a specific product by ID.
    - `PUT`: Update a specific product by ID.
    - `DELETE`: Delete a specific product by ID.

For detailed information on each endpoint, including request and response formats, please refer to the [API documentation](https://example.com/api-docs).


## Examples


## Contributing
We welcome contributions from the community! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on our [GitHub repository](https://github.com/kirlosbasta/E-commerce_API).

## License
The Marketer API is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contact
If you have any questions or need further assistance, please check my at
[Git].


