import express from 'express';
import { checkrole, user } from '../controller/user.js';


const router = express.Router();

router.post("/",user);
router.get("/checkrole/:userid",checkrole)

export default router;
