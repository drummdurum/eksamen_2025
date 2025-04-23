export default function adminMiddleware(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
         console.log('user er logget ind' + req.session.user); 
        next();
    } else {
        res.redirect('/login');
    }
}