import express from 'express';
import multer from 'multer';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// create deposit (user uploads proof)
router.post('/', authMiddleware, upload.single('proof'), async (req,res)=>{
  const user = req.user;
  const amount = parseInt(req.body.amount,10);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });
  const proofPath = req.file ? req.file.path : null;
  try {
    const { rows } = await pool.query('INSERT INTO deposits (user_id, amount_bigint, proof_path, status) VALUES ($1,$2,$3,$4) RETURNING id', [user.id, amount, proofPath, 'pending']);
    res.json({ ok: true, depositId: rows[0].id });
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

// list user's deposits
router.get('/my', authMiddleware, async (req,res)=>{
  const user = req.user;
  const { rows } = await pool.query('SELECT * FROM deposits WHERE user_id=$1 ORDER BY created_at DESC', [user.id]);
  res.json(rows);
});

export default router;
