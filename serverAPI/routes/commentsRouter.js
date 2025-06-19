import express from 'express';

const router = express.Router();

import authMiddleware from '../middleware/authMiddelware.js'; 
import db from './../../database/connection.js';


router.get('/bars/:barId/comments', async (req, res) => {
  const comments = await db.all('SELECT text, username FROM comments WHERE bar_id = ?', [req.params.barId]);
  res.json(comments);
});

router.post('/bars/comments', authMiddleware, async (req, res) => {
  const { barId, text, username } = req.body;
  await db.run('INSERT INTO comments (bar_id, username, text) VALUES (?, ?, ?)', [barId, username, text]);

  req.app.get('io').to(`bar-${barId}`).emit('newComment', { barId, text, username });

  res.status(201).json({ message: 'Kommentar gemt' });
});


export default router;
