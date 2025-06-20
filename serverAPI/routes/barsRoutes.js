import { Router } from 'express';
const router = Router();

import db from './../../database/connection.js'; 

import { sendBarPhoto } from './../../serverAPI/service/googleApiPhoto.js';
import { fetchBarOverview } from './../../serverAPI/service/googleApiOwerview.js';
import { searchBarByName } from './../../serverAPI/service/googleApiSerchOne.js';

import 'dotenv/config';


router.get('/bars', async (req, res) => {
    const bars = await db.all(`SELECT * FROM bars ORDER BY name COLLATE NOCASE ASC`);

    for (const bar of bars) {
        const types = await db.all(`SELECT type FROM bar_types WHERE bar_id = ?`, [bar.id]);
        bar.types = types.map(t => t.type);
    }
    
    res.json(bars);
});

router.get('/bars/types', async (req, res) => {
    const bars = await db.all('SELECT * FROM bars');
    for (const bar of bars) {
        const types = await db.all('SELECT type FROM bar_types WHERE bar_id = ?', [bar.id]);
        bar.types = types.map(t => t.type);
    }
    res.json(bars);
});

router.get("/bars/names", async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: "Mangler bar navn" });

    try {
        const bars = await db.all('SELECT * FROM bars WHERE name = ? COLLATE NOCASE',
            [name.trim()]);
        if (bars.length === 0) {
            return res.status(404).json({ error: "Bar ikke fundet" });
        }
        res.json(bars);
    } catch (err) {
        console.error('Databasefejl:', err.message);
        res.status(500).json({ error: "Databasefejl" });
    }
});

router.get('/bars/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const bar = await db.get('SELECT * FROM bars WHERE id = ?', [id]);
        if (!bar) return res.status(404).send('Bar ikke fundet');
        
        const types = await db.all('SELECT type FROM bar_types WHERE bar_id = ?', [id]);
        bar.types = types.map(t => t.type);
        res.status(200).json(bar);
    } catch (err) {
        console.error('Databasefejl:', err);
        res.status(500).send('Fejl ved hentning af bar');
    }
});

router.get('/bars/by-ids/finds', async (req, res) => {
    const ids = (req.query.ids || '').split(',').map(id => id.trim()).filter(Boolean);
    if (!ids.length) return res.status(400).json({ error: "Ingen id'er angivet" });

    const bars = [];
    for (const id of ids) {
        const bar = await db.get('SELECT * FROM bars WHERE id = ?', [id]);
        if (bar) {
            const types = await db.all('SELECT type FROM bar_types WHERE bar_id = ?', [id]);
            bar.types = types.map(t => t.type);
            bars.push(bar);
        }
    }
    res.json(bars);
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
        const bars = await db.all(
            'SELECT * FROM bars WHERE name LIKE ? COLLATE NOCASE',
            [`%${q}%`]
        );

        if (bars.length === 0) {
            return res.status(404).json({ error: "Bar ikke fundet" });
        }
        for (const bar of bars) {
            const types = await db.all(
                'SELECT type FROM bar_types WHERE bar_id = ?',
                [bar.id]
            );
            bar.types = types.map(t => t.type);
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

    const filtered = results.filter(bar => {
        const addr = bar.formatted_address || bar.vicinity || '';
        const match = addr.match(/\b(\d{4})\b/);
        if (!match) return false;
        const zip = parseInt(match[1], 10);
        return zip >= 1000 && zip <= 3000;
    });
    res.json(filtered);
});

router.post('/bars', async (req, res) => {
    try {
        const bar = req.body;
        const vicinity = bar.vicinity || bar.formatted_address || '';

        const {
            name,
            rating,
            user_ratings_total,
            place_id,
            photo_reference,
            types = []
        } = bar;

        const result = await db.run(`
            INSERT INTO bars (name, rating, user_ratings_total, vicinity, place_id, photo_reference)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, rating, user_ratings_total, vicinity, place_id, photo_reference]);

        const barId = result.lastID;

        
        const skipTypes = ["lodging", "point_of_interest", "establishment"];
        const filteredTypes = types.filter(type => !skipTypes.includes(type));
        
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

router.post('/bars/ratings', async (req, res) => {
    const { barId, rating } = req.body;

    if (!barId || !rating) {
        return res.status(400).json({ error: 'Bar ID og rating er påkrævet' });
    }

    try {
        const bar = await db.get('SELECT bartobar_rating, bartobar_votes FROM bars WHERE id = ?', [barId]);
        if (!bar) return res.status(404).json({ error: 'Bar ikke fundet' });

        const oldAvg = bar.bartobar_rating || 0;
        const oldCount = bar.bartobar_votes || 0;
        const newCount = oldCount + 1;
        const newAvg = Math.round((((oldAvg * oldCount) + Number(rating)) / newCount) * 10) / 10;

        await db.run('UPDATE bars SET bartobar_rating = ?, bartobar_votes = ? WHERE id = ?', [newAvg, newCount, barId]);
        
        req.app.get('io').to(`bar-${barId}`).emit('newRating', {
            barId,
            rating,
            newAvg,
            newCount,
            username: req.session?.user?.username || 'Ukendt bruger'
        });

        res.status(200).json({ 
            message: `Tak for din stemme!`,
            newAvg,
            newCount
        });
    } catch (error) {
        console.error('Fejl ved opdatering af rating:', error);
        res.status(500).json({ error: 'Intern serverfejl' });
    }
});

export default router;

