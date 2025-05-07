import { Router } from 'express';
const router = Router();

import bcrypt from 'bcryptjs';


import db from './../../database/connection.js';


router.get('/username', async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
    const userId = req.session.user.userId;

    const user = await db.get(`SELECT name, email FROM users WHERE id = ?`, [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/user', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Tjek om brugeren er logget ind
    if (!req.session || !req.session.user || !req.session.user.userId) {
      return res.status(401).send({ message: 'Unauthorized: User not logged in' });
    }

    const userId = req.session.user.userId;

    // Tjek om email allerede bruges af en anden bruger
    const existingEmail = await db.get(`
      SELECT * FROM users WHERE email = ? AND id != ?
    `, [email, userId]);

    if (existingEmail) {
      return res.status(400).send({ message: 'Email bliver allerede brugt af en anden bruger' });
    }

    // Tjek om brugernavn allerede bruges af en anden bruger
    const existingUser = await db.get(`
      SELECT * FROM users WHERE name = ? AND id != ?
    `, [username, userId]);

    if (existingUser) {
      return res.status(400).send({ message: 'Brugernavnet er allerede taget af en anden bruger' });
    }

    // Hash password, hvis det opdateres
    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = bcrypt.hashSync(password, saltRounds);
    }

    // Opdater brugerens data i databasen
    if (hashedPassword) {
      await db.run(`
        UPDATE users
        SET name = ?, email = ?, password = ?
        WHERE id = ?
      `, [username, email, hashedPassword, userId]);
    } else {
      await db.run(`
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
      `, [username, email, userId]);
    }

    // Opdater sessionen med det nye brugernavn
    req.session.user.username = username;

    res.status(200).send({ message: 'Brugeroplysninger opdateret med succes' });
  } catch (error) {
    console.error('Fejl under opdatering af bruger:', error);
    res.status(500).send({ message: 'Intern serverfejl' });
  }
});


export default router;