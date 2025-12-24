import express from 'express';
import { getproducts, uploadproduct } from '../controller/products.js';

const router = express.Router();

router.get("/getproducts/:userid",getproducts)
router.post("/uploadproduct",uploadproduct);
export default router;
