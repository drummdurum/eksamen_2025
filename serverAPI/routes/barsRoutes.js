import { Router } from 'express';
const router = Router();

import db from './../../database/connection.js'; 

router.get('/bars', async (req, res) => {
    const bars = await db.all(`SELECT * FROM bars`);

    for (const bar of bars) {
        const types = await db.all(`SELECT type FROM bar_types WHERE bar_id = ?`, [bar.id]);
        bar.types = types.map(t => t.type);
    }
    
    res.json(bars);
});

router.get('/bars/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Henter bar med id: ${id}`);

    const query = `SELECT * FROM bars WHERE id = ?`;

    try {
        const row = await db.get(query, [id]);
        if (!row) {
            console.log('Ingen bar fundet med dette id');
            return res.status(404).send('Bar ikke fundet');
        }
        console.log('Bar fundet:', row);
        res.status(200).json(row);
    } catch (err) {
        console.error('Databasefejl:', err);
        res.status(500).send('Fejl ved hentning af bar');
    }
});

export default router;
