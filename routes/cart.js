import express from 'express';
import { cart, getcart } from "../controller/cart.js";

const router = express.Router();

router.post("/",cart);
router.get("/:userId",getcart);

export default router;
