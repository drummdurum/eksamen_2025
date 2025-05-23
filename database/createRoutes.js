import db from './../database/connection.js';

await db.exec(`
  CREATE TABLE IF NOT EXISTS bar_Router (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0
  );
`);