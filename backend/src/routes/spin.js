import express from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const sectors = [
  {label:'20000KZ', amount:20000, win:true},
  {label:'35000KZ', amount:35000, win:true},
  {label:'45000KZ', amount:45000, win:true},
  {label:'PERDEU', amount:0, win:false},
  {label:'60000KZ', amount:60000, win:true},
  {label:'75000KZ', amount:75000, win:true},
  {label:'90000KZ', amount:90000, win:true},
  {label:'PERDEU', amount:0, win:false},
  {label:'100000KZ', amount:100000, win:true},
  {label:'150000KZ', amount:150000, win:true},
  {label:'200000KZ', amount:200000, win:true},
  {label:'PERDEU', amount:0, win:false}
];

router.post('/', authMiddleware, async (req,res)=>{
  const user = req.user;
  const bet = parseInt(req.body.bet,10);
  if (isNaN(bet) || bet < 5000 || bet > 50000) return res.status(400).json({ error: 'Aposta inválida (min 5000 - max 50000)' });
  if (parseInt(user.balance_bigint||0,10) < bet) return res.status(400).json({ error: 'Saldo insuficiente' });

  // debita aposta
  try {
    await pool.query('UPDATE users SET balance_bigint = balance_bigint - $1 WHERE id=$2', [bet, user.id]);

    const win = Math.random() < 0.15; // 15% chance to win
    let targetSectorIndex;
    let payout = 0;
    if (win) {
      const winningIndices = sectors.map((s,i)=> s.win ? i : -1).filter(i=> i>=0);
      targetSectorIndex = winningIndices[Math.floor(Math.random()*winningIndices.length)];
      payout = sectors[targetSectorIndex].amount;
      await pool.query('UPDATE users SET balance_bigint = balance_bigint + $1 WHERE id=$2', [payout, user.id]);
    } else {
      const losingIndices = sectors.map((s,i)=> s.win ? -1 : i).filter(i=> i>=0);
      targetSectorIndex = losingIndices[Math.floor(Math.random()*losingIndices.length)];
    }

    await pool.query('INSERT INTO spins (user_id, bet_amount_bigint, result_amount_bigint, sector_index, is_win) VALUES ($1,$2,$3,$4,$5)', [user.id, bet, payout, targetSectorIndex, win]);

    res.json({ sectorIndex: targetSectorIndex, isWin: win, payout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
