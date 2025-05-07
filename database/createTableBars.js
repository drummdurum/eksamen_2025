import db from './../database/connection.js';

await db.exec(`
    CREATE TABLE IF NOT EXISTS bars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        types TEXT,
        rating REAL,
        user_ratings_total INTEGER,
        vicinity TEXT
    )
`);