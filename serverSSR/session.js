import 'dotenv/config';
import session from 'express-session';
import pkg from 'pg';
const { Pool } = pkg;

let sessionMiddleware;

if (process.env.NODE_ENV === 'production' && process.env.PGHOST) {
  // Use PostgreSQL session store in production
  const pgSession = await import('connect-pg-simple');
  const PostgreSQLStore = pgSession.default(session);
  
  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false
  });

  sessionMiddleware = session({
    store: new PostgreSQLStore({
      pool: pool,
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  });

} else {
  // Use SQLite session store in development  
  const SQLiteStore = await import('connect-sqlite3');
  const Store = SQLiteStore.default(session);

  sessionMiddleware = session({
    store: new Store({
      db: 'sessions.db',
      dir: './database'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  });
}

export default sessionMiddleware;