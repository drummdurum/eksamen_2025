import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; 
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'users.db');

const connection = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

export default connection;
