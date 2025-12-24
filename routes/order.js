import express from 'express';
import { checkoutpayment } from '../controller/payment.js';
const router = express.Router();

router.post("/",checkoutpayment)

export default router;
