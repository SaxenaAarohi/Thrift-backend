import Stripe from 'stripe';
import pool from '../db/index.js';
 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutpayment = async (req, res) => {
   
    try {
        const { buyer_id, products } = req.body;

        const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0)
        await pool.query('BEGIN');

        const query1 = `insert into orders (buyer_id,total_amount) values ($1,$2) RETURNING id`
        const orderresult = await pool.query(query1, [buyer_id, totalAmount]);
        const orderId = orderresult.rows[0].id;

        for (const item of products) {
              const price = parseInt(item.price);
            await pool.query(
                `INSERT INTO order_items 
         (order_id, product_id, seller_id, quantity, price, seller_earning)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, item.id, item.seller_id, item.quantity, price, price * item.quantity]
            );
        }

        await pool.query(`delete from cart where user_id = $1`,[buyer_id]);

        await pool.query('COMMIT');

        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }

        const lineItems = products.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: 'https://thrift-frontend.vercel.app/success',
            cancel_url: 'https://thrift-frontend.vercel.app/cancel',
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ error: error.message });
    }

    
}
