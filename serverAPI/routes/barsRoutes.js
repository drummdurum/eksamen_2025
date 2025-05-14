import { Router } from 'express';
const router = Router();

import db from './../../database/connection.js'; 

import { sendBarPhoto } from './../../serverAPI/service/googleApiPhoto.js';
import { fetchBarOverview } from './../../serverAPI/service/googleApiOwerview.js';
import { searchBarByName } from './../../serverAPI/service/googleApiSerchOne.js';

import 'dotenv/config';


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
    try {
        const bar = await db.get('SELECT * FROM bars WHERE id = ?', [id]);
        if (!bar) return res.status(404).send('Bar ikke fundet');
        // Hent typer fra bar_types
        const types = await db.all('SELECT type FROM bar_types WHERE bar_id = ?', [id]);
        bar.types = types.map(t => t.type);
        res.status(200).json(bar);
    } catch (err) {
        console.error('Databasefejl:', err);
        res.status(500).send('Fejl ved hentning af bar');
    }
});

router.get('/bars/:id/photos', async (req, res) => {
    const { id } = req.params;
    try {
        const bar = await db.get('SELECT photo_reference, place_id FROM bars WHERE id = ?', [id]);
        if (!bar) return res.status(404).send('Bar ikke fundet');
        await sendBarPhoto({
            photoReference: bar.photo_reference,
            placeId: bar.place_id,
            db,
            barId: id,
            res
        });
    } catch (err) {
        console.error('Fejl ved billedkald:', err);
        res.status(500).send('Serverfejl');
    }
});

router.get('/bars/:id/owerviews', async (req, res) => {
    const { id } = req.params;
    try {
        const bar = await db.get('SELECT place_id FROM bars WHERE id = ?', [id]);
        if (!bar || !bar.place_id) return res.status(404).send('Bar ikke fundet');
        const overviewData = await fetchBarOverview(bar.place_id);
        res.json(overviewData);
    } catch (err) {
        console.error('Fejl ved hentning af overview:', err);
        res.status(500).send('Serverfejl');
    }
});

router.get('/bars/search/bars', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Mangler søgeord" });

    try {
        const bars = await db.all('SELECT * FROM bars WHERE name LIKE ? COLLATE NOCASE', [`%${q}%`]);
        if (bars.length === 0) {
            return res.status(404).json({ error: "Bar ikke fundet" }); // ✅ korrekt
        }
        res.json(bars);
    } catch (err) {
        console.error('Databasefejl:', err.message);
        res.status(500).json({ error: "Databasefejl" });
    }
});

router.get('/bars/search-external/bars', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Mangler søgeord' });
    const results = await searchBarByName(q);
    res.json(results);
});

router.post('/bars', async (req, res) => {
    try {
        const bar = req.body;
        const {
            name,
            rating,
            user_ratings_total,
            vicinity,
            place_id,
            photo_reference,
            types = []
        } = bar;

        // Indsæt bar
        const result = await db.run(`
            INSERT INTO bars (name, rating, user_ratings_total, vicinity, place_id, photo_reference)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, rating, user_ratings_total, vicinity, place_id, photo_reference]);

        const barId = result.lastID;

        // Filtrer typer hvis nødvendigt
        const skipTypes = ["lodging", "point_of_interest", "establishment"];
        const filteredTypes = types.filter(type => !skipTypes.includes(type));

        // Indsæt typer
        for (const type of filteredTypes) {
            await db.run(`
                INSERT INTO bar_types (bar_id, type)
                VALUES (?, ?)
            `, [barId, type]);
        }

        res.status(201).json({ message: `Indsat bar ${name} med id ${barId} og ${filteredTypes.length} typer`, barId });
    } catch (err) {
        console.error('Fejl ved indsættelse af bar:', err);
        res.status(500).json({ error: 'Fejl ved indsættelse af bar' });
    }
});

export default router;

