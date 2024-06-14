const { Router } = require('express');
const customerRouter = require('./customerRoute.js');
const productRouter = require('./productRoute.js');
const addressRouter = require('./addressRoute.js');
const categoryRouter = require('./categoryRoute.js');
const categoryLinkRouter = require('./categoryProductLinkRoute.js');
const orderRouter = require('./orderRoute.js');
const productSearchRouter = require('./productSearchRoute.js');
const statusRouter = require('./statusRoute.js');
const authRouter = require('./authRoute.js');

const router = Router();

// The order here is very important. The first route that matches the request will be used.
router.use(authRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(categoryLinkRouter);
router.use(productSearchRouter);
// Any route after this will use the auth middleware (used in addressRoute)
router.use(addressRouter);
router.use(orderRouter);
router.use(statusRouter);

module.exports = router;
