const isLoggedIn = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.userAuth) return res.render('users/notAuthorized');
  next();
};

module.exports = isLoggedIn;
