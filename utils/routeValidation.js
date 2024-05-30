/**
 * Middleware to validate a customer exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validataCustomer (req, res, next) {
  const { customerId } = req.params;
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    return res.status(404).json({ Error: 'Customer not found' });
  }
  req.customer = customer;
  next();
}

/**
 * Middleware to validate an address exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validateAddress (req, res, next) {
  const address = await Address.findByPk(req.params.id);
  if (!address) {
    return res.status(404).json({ Error: 'Address not found' });
  }
  req.address = address;
  next();
}

/**
 * Middleware to validate a product exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validateProduct (req, res, next) {
  const product = await Product.findByPk(req.params.productId);
  if (!product) {
    return res.status(404).json({ Error: 'Product not found' });
  }
  req.product = product;
  next();
}

/**
 * Middleware to validate a category exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validateCategory (req, res, next) {
  const category = await Category.findByPk(req.params.categoryId);
  if (!category) {
    return res.status(404).json({ Error: 'Category not found' });
  }
  req.category = category;
  next();
}

/**
 * Middleware to validate an order exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validataOrder (req, res, next) {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) {
    return res.status(404).json({ Error: 'Order not found' });
  }
  req.order = order;
  next();
}

/**
 * Middleware to validate an order item exists
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
export async function validateOrderItem (req, res, next) {
  const orderItem = await OrderItem.findByPk(req.params.orderItemId);
  if (!orderItem) {
    return res.status(404).json({ Error: 'OrderItem not found' });
  }
  req.orderItem = orderItem;
  next();
}
