import pool from "../db/index.js";


export const getproducts = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ error: "User ID required" });
    }
    const query =  `
      SELECT p.*,
             CASE WHEN oi.id IS NOT NULL THEN true ELSE false END AS sold
      FROM products p
      LEFT JOIN order_items oi
      ON p.id = oi.product_id
      WHERE p.seller_id = $1
    `;
;
    const result = await pool.query(query, [userid]);

    res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const uploadproduct = async (req, res) => {

  try {
    const { title, price, condition, imageUrl, seller_id, brand, category, size, tags, } = req.body;


    const query = `insert into products (title,price,condition,img_url,seller_id,brand,category,size,tags)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

    const values = [title,price, condition, imageUrl, seller_id, brand, category, size, tags];
    const result = await pool.query(query, values);

    return res.json({
      success: true,
      message: "Product uploaded successfully"
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
