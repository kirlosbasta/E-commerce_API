import { Router } from 'express';
import customerRouter from './customerRoute.js';
import productRouter from './productRoute.js';
import addressRouter from './addressRoute.js';
import categoryRouter from './categoryRoute.js';

const router = Router();

router.use(customerRouter);
router.use(productRouter);
router.use(addressRouter);
router.use(categoryRouter);

export default router;