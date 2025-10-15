import db from './connection.js';

console.log('🗄️ Initialiserer database...');

const isPostgreSQL = process.env.NODE_ENV === 'production' && process.env.PGHOST;

try {
  if (isPostgreSQL) {
    // PostgreSQL syntax
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT false
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS bars (
        id SERIAL PRIMARY KEY,
        name TEXT,
        rating REAL, 
        user_ratings_total INTEGER, 
        bartobar_rating REAL, 
        bartobar_votes INTEGER, 
        vicinity TEXT,
        photo_reference TEXT,
        place_id TEXT
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS bar_types (
        id SERIAL PRIMARY KEY,
        bar_id INTEGER,
        type TEXT,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        bar_id INTEGER,
        username TEXT,
        text TEXT,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS must_try (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        bar_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE,
        UNIQUE(user_id, bar_id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
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

  } else {
    // SQLite syntax
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
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS bar_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bar_id INTEGER,
        type TEXT,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bar_id INTEGER,
        username TEXT,
        text TEXT,
        FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE
      );
    `);

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

    await db.exec(`
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
  }

  // Indsæt standard test brugere (kun hvis de ikke allerede eksisterer)
  const testUsers = [
    { username: 'testuser', password: '$2b$10$0oRTvyhXyVtzLj/FqZ9mFuxJEgMncSE4NKsepSObCe3.DEQbuDgUi', isAdmin: 0 },
    { username: 'admin', password: '$2b$10$6vCDosHmJjFP2L1Ryt0s2OVgMi5BmEQorl2xsffxfAqaNJjHap2Ie', isAdmin: 1 },
    { username: 'admin1', password: '$2b$10$26XZWG6Pued/1Gvg8diskeKmm5OGAVh15yWt2nOiABm16S8hMiT6i', isAdmin: 1 },
    { username: 'guest', password: '$2b$10$5osX6ogd.om.XHZdPtW/l.KpVizDssM98L5mcWbpntNkp4nfkNcza', isAdmin: 0 }
  ];

  for (const user of testUsers) {
    if (isPostgreSQL) {
      await db.run(`
        INSERT INTO users (name, email, password, isAdmin)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [user.username, `${user.username}@example.com`, user.password, user.isAdmin]);
    } else {
      await db.run(`
        INSERT OR IGNORE INTO users (name, email, password, isAdmin)
        VALUES (?, ?, ?, ?)
      `, [user.username, `${user.username}@example.com`, user.password, user.isAdmin]);
    }
  }

  console.log(`✅ Database initialiseret succesfuldt (${isPostgreSQL ? 'PostgreSQL' : 'SQLite'})`);
  
} catch (error) {
  console.error('❌ Fejl ved database initialisering:', error);
  throw error;
}

export default db;