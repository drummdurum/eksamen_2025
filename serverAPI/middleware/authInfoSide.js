export default function authMiddlewareInfoSide(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        // Hvis det er en API-request (fx Accept: application/json eller X-Requested-With)
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ error: 'Du skal være logget ind' });
        }
        // Ellers redirect (fx for browser-side navigation)
        res.redirect('/login');
    }
}