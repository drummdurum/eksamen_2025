import db from '../../database/connection.js';

export default async function authMiddleware(req, res, next) {
    // Robust user validation
    let hasValidUser = false;
    
    if (req.session?.user?.userId) {
        hasValidUser = true;
    } else if (req.session?.user?.username) {
        try {
            const user = await db.get('SELECT id FROM users WHERE name = ?', [req.session.user.username]);
            if (user) {
                // Update session with userId if missing
                req.session.user.userId = user.id;
                hasValidUser = true;
            }
        } catch (err) {
            console.error('Error validating user in authMiddleware:', err);
        }
    }
    
    if (hasValidUser) {
        next();
    } else {
        req.session.message = 'Du skal være logget ind som bruger for at få adgang til denne side.';
        res.status(401).json({ error: 'Du skal være logget ind som bruger for at få adgang til denne side.' });
    }
}

  