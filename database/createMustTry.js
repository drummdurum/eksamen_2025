import db from './../database/connection.js';

await db.exec(`
  CREATE TABLE IF NOT EXISTS must_try (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bar_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE,
    UNIQUE(user_id, bar_id)
  );
`);