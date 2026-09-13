import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secure_secret';

export async function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Bad token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, phone, name, is_admin, balance_bigint FROM users WHERE id=$1', [payload.userId]);
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminMiddleware(req,res,next){
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });
  next();
}
