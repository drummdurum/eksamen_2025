export default function authMiddlewareInfoSide(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ error: 'Du skal være logget ind' });
        }
        res.redirect('/login');
    }
}