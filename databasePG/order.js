import pool from './../databasePG/connection.js';

await pool.query(`

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT,
    address TEXT,
    zip TEXT,
    city TEXT,
    email TEXT,
    order_data JSONB,
    status TEXT deFAULT 'created',
    stripe_session_id TEXT unique,
    total_price INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);