import db from './../database/connection.js';
//DROP TABLE IF EXISTS bars;
  //  DROP TABLE IF EXISTS bar_types;
 
await db.exec(`
    CREATE TABLE IF NOT EXISTS bars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        rating REAL, 
        user_ratings_total INTEGER, 
        bartobar_rating REAL, 
        bartobar_votes INTEGER, 
        vicinity TEXT,
        photo_reference TEXT,
        place_id TEXT
    );
    CREATE TABLE IF NOT EXISTS bar_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bar_id INTEGER,
        type TEXT,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
    );
`);