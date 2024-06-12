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

router.use(authRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(addressRouter);
router.use(categoryRouter);
router.use(categoryLinkRouter);
router.use(orderRouter);
router.use(productSearchRouter);
router.use(statusRouter);

module.exports = router;