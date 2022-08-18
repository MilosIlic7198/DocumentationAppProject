function already_Auth(req, res, next) {
  if (req.session.user) {
    res.redirect("/release");
  } else {
    next();
  }
}

module.exports = already_Auth;
