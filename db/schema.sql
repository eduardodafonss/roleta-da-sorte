-- Schema inicial para Roleta da Sorte

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance_bigint BIGINT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  iban TEXT,
  beneficiary_name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount_bigint BIGINT NOT NULL,
  proof_path TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount_bigint BIGINT NOT NULL,
  fee_bigint BIGINT NOT NULL,
  net_amount_bigint BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  processed_at TIMESTAMP,
  processed_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS spins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  bet_amount_bigint BIGINT NOT NULL,
  result_amount_bigint BIGINT DEFAULT 0,
  sector_index INTEGER NOT NULL,
  is_win BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  admin_id INTEGER REFERENCES users(id),
  content TEXT,
  from_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);
