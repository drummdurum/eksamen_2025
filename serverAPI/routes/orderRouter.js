import Router from 'express';
import pool from '../../databasePG/connection.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/orders/all', adminMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  res.json(result.rows);
});


router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Order not found" });
  res.json(result.rows[0]);
});

router.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM orders WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Order not found" });
  res.json({ success: true });
});

export default router;