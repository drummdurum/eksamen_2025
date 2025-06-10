// database/pgConnection.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.PGUSER, process.env.PGPASSWORD, process.env.PGHOST, process.env.PGDATABASE, process.env.PGPORT);

const pool = new Pool(); // Bruger .env automatisk



export default pool;
