import db from '../../database/connection.js';

export default async function adminMiddleware(req, res, next) {
    // Robust admin validation
    let isAdmin = false;
    
    if (req.session?.user?.isAdmin) {
        isAdmin = true;
    } else if (req.session?.user?.username) {
        try {
            const user = await db.get('SELECT id, isAdmin FROM users WHERE name = ?', [req.session.user.username]);
            if (user?.isAdmin) {
                // Update session with admin status if missing
                req.session.user.isAdmin = user.isAdmin;
                req.session.user.userId = user.id;
                isAdmin = true;
            }
        } catch (err) {
            console.error('Error validating admin in adminMiddleware:', err);
        }
    }
    
    if (isAdmin) {
        next();
    } else {
        req.session.message = 'Du skal være logget ind som admin for at få adgang til denne side.';
        res.status(401).json({ error: 'Du skal være logget ind som admin for at få adgang til denne side.' });
    }
}
