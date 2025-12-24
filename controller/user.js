import pool from "../db/index.js";

export const user = async(req, res) => {
    
       try {
    const { user_id,email, username, role, phone, address } = req.body;

    const query = `
      INSERT INTO users (id,email, name, role, phone, address)
      VALUES ($1, $2, $3, $4, $5 ,$6)
      RETURNING *;
    `;

    const values = [user_id,email, username, role, phone, address];

    const result = await pool.query(query, values);

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkrole = async(req,res) => {
  try {
    const { userid } = req.params;  
    const query = `SELECT role FROM users WHERE id = $1`;
    const values = [userid];

    const result = await pool.query(query, values); 

      if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        role: null,
      });
    }
    return res.json({
      success: true,
      role: result.rows[0].role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};