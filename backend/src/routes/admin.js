import express from 'express';
import { pool } from '../db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// require admin for these routes
router.get('/deposits', authMiddleware, adminMiddleware, async (req,res)=>{
  const { rows } = await pool.query('SELECT d.*, u.phone, u.name FROM deposits d JOIN users u ON u.id = d.user_id ORDER BY d.created_at DESC');
  res.json(rows);
});

router.post('/deposits/:id/approve', authMiddleware, adminMiddleware, async (req,res)=>{
  const id = req.params.id;
  const { rows } = await pool.query('SELECT * FROM deposits WHERE id=$1', [id]);
  if (rows.length===0) return res.status(404).json({ error: 'Not found' });
  const deposit = rows[0];
  if (deposit.status !== 'pending') return res.status(400).json({ error: 'Already processed' });
  try {
    await pool.query('UPDATE deposits SET status=$1, approved_by=$2, approved_at=now() WHERE id=$3', ['approved', req.user.id, id]);
    await pool.query('UPDATE users SET balance_bigint = balance_bigint + $1 WHERE id=$2', [deposit.amount_bigint, deposit.user_id]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

router.post('/deposits/:id/reject', authMiddleware, adminMiddleware, async (req,res)=>{
  const id = req.params.id;
  await pool.query('UPDATE deposits SET status=$1 WHERE id=$2', ['rejected', id]);
  res.json({ ok: true });
});

// list users
router.get('/users', authMiddleware, adminMiddleware, async (req,res)=>{
  const { rows } = await pool.query('SELECT id, phone, name, balance_bigint, is_admin, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

export default router;
