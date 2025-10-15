import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; 
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let connection;

// Check if we're in production (Railway) or development
if (process.env.NODE_ENV === 'production' && process.env.PGHOST) {
  // Use PostgreSQL in production (Railway)
  console.log('🐘 Connecting to PostgreSQL database...');
  
  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false
  });

  // Create a wrapper to make PostgreSQL work like SQLite
  connection = {
    async exec(sql) {
      const client = await pool.connect();
      try {
        const result = await client.query(sql);
        return result;
      } finally {
        client.release();
      }
    },

    async run(sql, params = []) {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return { lastID: result.rows[0]?.id, changes: result.rowCount };
      } finally {
        client.release();
      }
    },

    async get(sql, params = []) {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return result.rows[0];
      } finally {
        client.release();
      }
    },

    async all(sql, params = []) {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return result.rows;
      } finally {
        client.release();
      }
    }
  };

} else {
  // Use SQLite in development
  console.log('📁 Connecting to SQLite database...');
  
  const dbPath = join(__dirname, '..', 'users.db');
  
  connection = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export default connection;
