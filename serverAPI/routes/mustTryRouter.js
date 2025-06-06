import Router from 'express';
import db from '../../database/connection.js';
const router = Router();


router.get('/mustTrys', async (req, res) => {
    const userId = req.session.user?.userId;
    if (!userId) return res.status(401).json({ error: "Ikke logget ind" });
    const bars = await db.all(
        `SELECT b.id, b.name, b.vicinity
         FROM must_try mt
         JOIN bars b ON mt.bar_id = b.id
         WHERE mt.user_id = ?`,
        [userId]
    );
    res.json(bars);
});


router.post('/mustTrys', async (req, res) => {
    const userId = req.session.user?.userId;
    const { barId } = req.body;
    if (!userId || !barId) return res.status(400).json({ error: "Mangler data" });
    try {
        await db.run(
            `INSERT INTO must_try (user_id, bar_id) VALUES (?, ?)`,
            [userId, barId]
        );
        res.json({ success: true });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({ error: "Bar allerede på listen" });
        } else {
            res.status(500).json({ error: "Serverfejl" });
        }
    }
});

router.delete('/mustTrys/:barId', async (req, res) => {
    const userId = req.session.user?.userId;
    const barId = req.params.barId;
    if (!userId || !barId) return res.status(400).json({ error: "Mangler data" });
    await db.run(
        `DELETE FROM must_try WHERE user_id = ? AND bar_id = ?`,
        [userId, barId]
    );
    res.json({ success: true });
});

export default router;