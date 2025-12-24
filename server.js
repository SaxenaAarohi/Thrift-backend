import cors from 'cors';
import express from 'express';
import pool from './db/index.js';
import cartRouter from './routes/cart.js';
import order from './routes/order.js';
import createuser from './routes/createuser.js';
import getproducts from './routes/products.js';

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

const PORT = process.env.PORT

app.get('/product', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
})

app.get('/api/gettotal/:sellerid',async(req,res)=>{
  const {sellerid} = req.params;
  const result = await pool.query(`select sum(seller_earning) from order_items where seller_id = $1 ` , [sellerid]);

  const total = result.rows[0].sum;
 
  res.json(total);
})

app.use('/api/checkout',order);
app.use("/api/products", getproducts);
app.use("/api/user", createuser);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});