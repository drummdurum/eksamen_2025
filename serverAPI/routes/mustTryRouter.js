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
    // More robust way to get userId
    let userId = req.session?.user?.userId;
    
    // Fallback: if userId is missing, try to get it from database using session user info
    if (!userId && req.session?.user?.username) {
        try {
            const user = await db.get('SELECT id FROM users WHERE name = ?', [req.session.user.username]);
            userId = user?.id;
        } catch (err) {
            console.error('Error getting userId from username:', err);
        }
    }
    
    const { barId } = req.body;
    
    // Debug logging
    console.log('MustTry POST request:', {
        userId: userId,
        barId: barId,
        body: req.body,
        session: req.session?.user ? req.session.user : 'missing',
        sessionId: req.sessionID
    });
    
    if (!userId) {
        return res.status(401).json({ 
            error: "Ikke logget ind",
            debug: { hasSession: !!req.session, hasUser: !!req.session?.user }
        });
    }
    
    if (!barId) {
        return res.status(400).json({ 
            error: "Mangler bar data",
            debug: { userId: !!userId, barId: !!barId, receivedBody: req.body }
        });
    }
    
    try {
        await db.run(
            `INSERT INTO must_try (user_id, bar_id) VALUES (?, ?)`,
            [userId, barId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('MustTry database error:', err);
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