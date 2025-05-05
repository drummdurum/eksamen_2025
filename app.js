import express from 'express';
import sessionMiddleware from './serverSSR/session.js';
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware til session-håndtering
app.use(sessionMiddleware);

import pagesRouter from './serverAPI/routes/pagesRoutes.js';
app.use(pagesRouter);

import authRouter from './serverAPI/routes/authRoutes.js';
app.use(authRouter);

import mailRouters from './serverAPI/routes/mailRoutes.js'
app.use(mailRouters)



const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
