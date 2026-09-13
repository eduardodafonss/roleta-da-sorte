import express from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// create withdrawal request
router.post('/', authMiddleware, async (req,res)=>{
  const user = req.user;
  const { iban, beneficiary_name, amount } = req.body;
  const amt = parseInt(amount,10);
  if (!iban || !beneficiary_name) return res.status(400).json({ error: 'IBAN e nome do beneficiário são obrigatórios' });
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Valor inválido' });
  if (amt <= 0) return res.status(400).json({ error: 'Valor inválido' });
  if (parseInt(user.balance_bigint||0,10) < amt) return res.status(400).json({ error: 'Saldo insuficiente' });
  // check 3 withdrawals per 24h
  const { rows: recent } = await pool.query("SELECT COUNT(*)::int as cnt FROM withdrawals WHERE user_id=$1 AND created_at > (now() - interval '24 hours')", [user.id]);
  if (recent[0].cnt >= 3) return res.status(400).json({ error: 'Limite de 3 saques por 24h alcançado' });

  const fee = Math.ceil(amt * 0.10);
  const net = amt - fee;

  try {
    // update user iban/name
    await pool.query('UPDATE users SET iban=$1, beneficiary_name=$2 WHERE id=$3', [iban, beneficiary_name, user.id]);
    // debit amount immediately (hold funds)
    await pool.query('UPDATE users SET balance_bigint = balance_bigint - $1 WHERE id=$2', [amt, user.id]);
    const { rows } = await pool.query('INSERT INTO withdrawals (user_id, amount_bigint, fee_bigint, net_amount_bigint, status) VALUES ($1,$2,$3,$4,$5) RETURNING id', [user.id, amt, fee, net, 'pending']);
    res.json({ ok: true, withdrawalId: rows[0].id });
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

// list user's withdrawals
router.get('/my', authMiddleware, async (req,res)=>{
  const user = req.user;
  const { rows } = await pool.query('SELECT * FROM withdrawals WHERE user_id=$1 ORDER BY created_at DESC', [user.id]);
  res.json(rows);
});

export default router;
