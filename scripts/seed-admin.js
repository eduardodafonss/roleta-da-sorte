// Execute: ADMIN_PASS=LAWISA11 node scripts/seed-admin.js
import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/roleta' });

async function seed() {
  const phone = process.env.ADMIN_PHONE || '938970887';
  const name = process.env.ADMIN_NAME || 'ADMIN';
  const pass = process.env.ADMIN_PASS || 'LAWISA11';
  const hash = await bcrypt.hash(pass, 10);
  await pool.query(
    `INSERT INTO users (phone, name, password_hash, balance_bigint, is_admin) VALUES ($1,$2,$3,0,true)
     ON CONFLICT (phone) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_admin = true`, 
     [phone, name, hash]
  );
  console.log('admin seeded (phone:', phone, ')');
  await pool.end();
}

seed().catch(err=>{ console.error(err); process.exit(1); });
