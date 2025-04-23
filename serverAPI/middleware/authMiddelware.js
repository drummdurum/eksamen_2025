export default function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
      // Brugeren er logget ind
      console.log('user er logget ind' + req.session.user);
      next();
    } else {
      res.redirect('/login');
    }
  }
