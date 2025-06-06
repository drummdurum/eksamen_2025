import db from './../database/connection.js';


await db.exec(`
  DROP TABLE IF EXISTS routes;

  CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS route_bars (
    route_id INTEGER NOT NULL,
    bar_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (route_id, bar_id),
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
  );
`);