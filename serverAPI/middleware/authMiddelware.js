export default function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
      // Brugeren er logget ind
      console.log('user er logget ind' + req.session.user);
      next();
    } else {
      req.session.message = 'Du skal være logget ind som bruger for at få adgang til denne side.';
      res.redirect('/login');
    }
  }
