import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secure_secret';

router.post('/register', async (req,res)=>{
  const { phone, name, password } = req.body;
  if (!phone || !name || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query('INSERT INTO users (phone,name,password_hash) VALUES ($1,$2,$3) RETURNING id, phone, name, is_admin, balance_bigint', [phone,name,hashed]);
    const user = result.rows[0];
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/login', async (req,res)=>{
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Missing fields' });
  const result = await pool.query('SELECT * FROM users WHERE phone=$1', [phone]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, phone: user.phone, name: user.name, is_admin: user.is_admin, balance: parseInt(user.balance_bigint||0,10) } });
});

// whoami
router.get('/me', authMiddleware, async (req,res)=>{
  // req.user is populated by authMiddleware
  const u = req.user;
  res.json({ id: u.id, phone: u.phone, name: u.name, is_admin: u.is_admin, balance: parseInt(u.balance_bigint||0,10), iban: u.iban, beneficiary_name: u.beneficiary_name });
});

export default router;
