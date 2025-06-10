import Router from 'express';
import pool from '../../databasePG/connection.js';


const router = Router();

router.get('/orders', async (req, res) => {
  const userId = req.session.user?.userId;
  if (!userId) return res.status(401).json({ error: "Ikke logget ind" });
  const result = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  res.json(result.rows);
});


export default router;