import Routes from 'express';
import db from './../../database/connection.js';

const router = Routes();

import authMiddlewareInfoSide from '../middleware/authInfoSide.js';

router.put('/newType', authMiddlewareInfoSide, async (req, res) => {
    const { type, barId } = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Type is required' });
    }
    try {
        await db.run(
            'INSERT INTO bar_types (bar_id, type) VALUES (?, ?)',
            [barId, type]
        );
        res.status(201).json({ message: `Type "${type}" tilføjet til bar ${barId}` });
    } catch (error) {
        console.error('Error adding type to bar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;