import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import pagesRouter from './routes/pagesRoutes.js';
app.use(pagesRouter);

import authRouter from './routes/authRoutes.js';
app.use(authRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
