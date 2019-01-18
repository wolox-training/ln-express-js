const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors'),
  tokens = require('./../services/tokens');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);

    User.findOne({ where: { email: user.email } }).then(u => {
      if (u && tokens.isValid(auth)) {
        req.user = u;
        next();
      } else {
        next(errors.unauthorized());
      }
    });
  } else {
    throw errors.unauthorized();
  }
};

exports.checkAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    throw errors.unauthorized();
  }
};
