import { Router } from 'express';
import customerRouter from './customerRoute.js';
import productRouter from './productRoute.js';
import addressRouter from './addressRoute.js';
import categoryRouter from './categoryRoute.js';
import categoryLinkRouter from './categoryProductLinkRoute.js';
import orderRouter from './orderRoute.js';
import productSearchRouter from './productSearchRoute.js';
import statusRouter from './statusRoute.js';
import authRouter from './authRoute.js';

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

export default router;