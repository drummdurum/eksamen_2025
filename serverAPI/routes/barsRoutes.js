import { Router } from 'express';
const router = Router();

import db from './../../database/connection.js'; 


router.post('/bars', (req, res) => {
    const { name, types, rating, user_ratings_total, vicinity } = req.body;

    const query = `
        INSERT INTO bars (name, types, rating, user_ratings_total, vicinity)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [name, types.join(', '), rating, user_ratings_total, vicinity], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Fejl ved indsættelse i databasen');
        }
        res.status(200).send({ id: this.lastID });
    });
});

router.get('/bars', (req, res) => {
    const query = `SELECT * FROM bars`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Fejl ved hentning af barer');
        }
        res.status(200).json(rows);
    });
});

router.get('/bars/:id', (req, res) => {
    const { id } = req.params; // Hent id fra URL'en
    console.log(`Henter bar med id: ${id}`); // Log ID'et

    const query = `SELECT * FROM bars WHERE id = ?`;
    console.log('Udfører forespørgsel:', query);

    db.get(query, [id], (err, row) => {
        console.log('Forespørgsel udført'); // Log efter forespørgslen
        if (err) {
            console.error('Databasefejl:', err);
            return res.status(500).send('Fejl ved hentning af bar');
        }
        if (!row) {
            console.log('Ingen bar fundet med dette id');
            return res.status(404).send('Bar ikke fundet');
        }
        console.log('Bar fundet:', row);
        res.status(200).json(row);
    });
});

export default router;
