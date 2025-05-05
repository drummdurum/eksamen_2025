import db from './../database/connection.js';

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`);

// Indsæt standardbrugere
const testUsers = [
    { username: 'testuser', password: '$2b$10$0oRTvyhXyVtzLj/FqZ9mFuxJEgMncSE4NKsepSObCe3.DEQbuDgUi', isAdmin: 0 },
    { username: 'admin', password: '$2b$10$6vCDosHmJjFP2L1Ryt0s2OVgMi5BmEQorl2xsffxfAqaNJjHap2Ie', isAdmin: 1 },
    { username: 'admin1', password: '$2b$10$26XZWG6Pued/1Gvg8diskeKmm5OGAVh15yWt2nOiABm16S8hMiT6i', isAdmin: 1 },
    { username: 'guest', password: '$2b$10$5osX6ogd.om.XHZdPtW/l.KpVizDssM98L5mcWbpntNkp4nfkNcza', isAdmin: 0 }
];

for (const user of testUsers) {
    await db.run(`
        INSERT OR IGNORE INTO users (name, email, password, isAdmin)
        VALUES (?, ?, ?, ?)
    `, [user.username, `${user.username}@example.com`, user.password, user.isAdmin]);
}