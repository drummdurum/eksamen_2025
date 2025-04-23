import 'dotenv/config';
import session from 'express-session';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Sæt til true, hvis du bruger HTTPS
});

export default sessionMiddleware;