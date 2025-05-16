import db from './../database/connection.js';


await db.exec(`
    DROP TABLE IF EXISTS comments;
    
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bar_id INTEGER,
    username TEXT,
    text TEXT,
    FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
    );
`);