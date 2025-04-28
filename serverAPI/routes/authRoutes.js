import { Router } from 'express';
import { compare } from 'bcrypt';
import bcrypt from 'bcryptjs';
import db from './../../database/connection.js'; // Importer databaseforbindelsen

const router = Router();

router.post('/loginSent', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find brugeren i databasen
        const user = await db.get(`
            SELECT * FROM users WHERE name = ?
        `, [username]);

        if (user) {
            // Sammenlign den indtastede adgangskode med den hashed adgangskode
            const isPasswordValid = await compare(password, user.password);

            if (isPasswordValid) {
                // Gem brugerdata i sessionen
                req.session.user = {
                    username: user.name,
                    isAdmin: user.isAdmin,
                };

                // Hvis adgangskoden er korrekt
                if (user.isAdmin) {
                    res.status(200).send({
                        message: 'Login successful! Welcome, Admin!',
                        isAdmin: true,
                    });
                } else {
                    res.status(200).send({
                        message: 'Login successful! Welcome, User!',
                        isAdmin: false,
                    });
                }
            } else {
                // Hvis adgangskoden er forkert
                res.status(401).send({ message: 'Unauthorized: Invalid credentials! forkert kdoe' });
            }
        } else {
            // Hvis brugeren ikke findes
            res.status(401).send({ message: 'Unauthorized: Invalid credentials! du findes ikke' });
        }
    } catch (error) {
        console.error('Fejl under login:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/logud', (req, res) => {
    // Ødelæg sessionen
    req.session.destroy(err => {
        if (err) {
            console.error('Fejl under logout:', err);
            return res.status(500).send('Kunne ikke logge ud');
        }
        res.redirect('/login');
    });
});

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Tjek om brugernavnet allerede findes
        const existingUser = await db.get(`
            SELECT * FROM users WHERE name = ?
        `, [username]);

        if (existingUser) {
            return res.status(400).send({ message: 'Brugernavnet er allerede taget' });
        }
       // Hash adgangskoden
       const saltRounds = 10;
       const hashedPassword = bcrypt.hashSync(password, saltRounds); // 10 er salt-rundeniveauet

       // Opret en ny bruger i databasen
       await db.run(`
           INSERT INTO users (name, email, password, isAdmin)
           VALUES (?, ?, ?, ?)
       `, [username, email, hashedPassword, 0]); // isAdmin er sat til 0 som standard
        
       req.session.user = {
        username: username,
        isAdmin: 0, // Nyoprettede brugere er ikke admin som standard
    };
       res.status(201).send({ message: 'Du er nu oprettet og bliver sendt til forsiden' });
        
    } catch (error) {
        console.error('Fejl under oprettelse af bruger:', error);
        res.status(500).send({ message: 'Intern serverfejl' });
    }
});

export default router;