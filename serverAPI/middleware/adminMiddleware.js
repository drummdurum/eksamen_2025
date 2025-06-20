export default function adminMiddleware(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        req.session.message = 'Du skal være logget ind som admin for at få adgang til denne side.';
        res.redirect('/login');
    }
}
