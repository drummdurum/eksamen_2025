import express from 'express';
import db from '../../database/connection.js';

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        const userId = req.session.user?.userId;
        if (!userId) return res.status(401).json({ error: "Ikke logget ind" });

        const routes = await db.all(
            'SELECT id, name FROM routes WHERE user_id = ?',
            [userId]
        );
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfejl" });
    }
});

router.get('/routes/:routeId', async (req, res) => {
    try {
        const userId = req.session.user?.userId;
        const routeId = req.params.routeId;

        if (!userId) return res.status(401).json({ error: "Ikke logget ind" });

        const route = await db.get(
            'SELECT id, name FROM routes WHERE id = ? AND user_id = ?',
            [routeId, userId]
        );
        if (!route) return res.status(404).json({ error: "Rute ikke fundet" });

      const bars = await db.all(
            `SELECT b.id, b.name, b.vicinity
            FROM route_bars rb
            JOIN bars b ON rb.bar_id = b.id
            WHERE rb.route_id = ?
            ORDER BY rb.position ASC`,
            [routeId]
        );

        res.json({ id: route.id, name: route.name, bars });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfejl" });
    }
});

router.post('/routes/:routeId/add-bar', async (req, res) => {
    const userId = req.session.user?.userId;
    const { barId } = req.body;
    const routeId = req.params.routeId;
    if (!userId) return res.status(401).json({ error: "Ikke logget ind" });
    
    const route = await db.get('SELECT id FROM routes WHERE id = ? AND user_id = ?', [routeId, userId]);
    if (!route) return res.status(404).json({ error: "Rute ikke fundet" });
    
    const pos = await db.get('SELECT MAX(position) as maxPos FROM route_bars WHERE route_id = ?', [routeId]);
    const nextPos = (pos?.maxPos ?? -1) + 1;
    await db.run('INSERT INTO route_bars (route_id, bar_id, position) VALUES (?, ?, ?)', [routeId, barId, nextPos]);
    res.json({ success: true });
});

router.post('/routes', async (req, res) => {
    try {
        const userId = req.session.user?.userId;
        const { name, bars } = req.body;

        console.log('userId:', userId, 'name:', name, 'bars:', bars);

        if (!userId || !name || !Array.isArray(bars) || bars.length === 0) {
            return res.status(400).json({ error: 'Ugyldige data' });
        }

        
        const result = await db.run(
            'INSERT INTO routes (user_id, name) VALUES (?, ?)',
            [userId, name]
        );
        const routeId = result.lastID;

        
        for (let i = 0; i < bars.length; i++) {
            await db.run(
                'INSERT INTO route_bars (route_id, bar_id, position) VALUES (?, ?, ?)',
                [routeId, bars[i], i]
            );
        }

        res.json({ success: true, routeId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Serverfejl' });
    }
});

router.delete('/routes/:routeId', async (req, res) => {
    try {
        const userId = req.session.user?.userId;
        const routeId = req.params.routeId;
        if (!userId) return res.status(401).json({ error: "Ikke logget ind" });

        const route = await db.get(
            'SELECT id FROM routes WHERE id = ? AND user_id = ?',
            [routeId, userId]
        );
        if (!route) return res.status(404).json({ error: "Rute ikke fundet" });

        await db.run('DELETE FROM routes WHERE id = ?', [routeId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfejl" });
    }
});

export default router;