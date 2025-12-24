import pool from "../db/index.js";
export const cart = async (req, res) => {
   try {
      const { userId, cart } = req.body;

      const items = cart.map(item => (
         {
            product: {
               id: item.id,
               title: item.title,
               price: item.price,
               img_url: item.img_url,
               size: item.size,
               seller_id : item.seller_id
            },
            quantity: item.quantity || 1

         }));

      const query = `
   insert into cart (user_id,items)
   values ($1 , $2)
    ON CONFLICT (user_id)
      DO UPDATE SET items = EXCLUDED.items, updated_at = NOW()
      RETURNING *;
   `

      const values = [userId, JSON.stringify(items)];

      const result = await pool.query(query, values);

      res.json({ success: true, cart: result.rows[0] });

   }
   catch (error) {
      console.error("Error saving cart:", error);
      res.status(500).json({ error: "Failed to save cart" });
   }

}
export const getcart = async (req, res) => {
   try {
      const { userId } = req.params;

      if (!userId) {
         return res.status(400).json({ error: "User ID required" });
      }

      const query = `Select * from cart 
     where user_id = $1`;

      const result = await pool.query(query,[userId]);
      res.status(200).json(result.rows[0]?.items || []);
   } catch (err) {
     console.error("GET CART ERROR:", err);
     res.status(500).json({ error: "Internal Server Error" });
   }
}