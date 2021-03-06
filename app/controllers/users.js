const User = require('../models').user,
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs');

exports.create = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
    : {};
  User.createUser(user)
    .then(response => {
      res.status(201);
      res.send();
    })
    .catch(next);
};

exports.getByEmail = (req, res, next) => {
  return User.getByEmail(req.query.email)
    .then(email => {
      if (email) {
        res.status(200);
        res.send(email);
      } else {
        next(errors.userNotFound());
      }
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};
  User.getByEmail(user.email).then(response => {
    if (response) {
      const isValid = bcrypt.compareSync(user.password, response.dataValues.password);
      if (isValid) {
        const auth = sessionManager.encode({ email: response.dataValues.email });

        res.status(200);
        res.set(sessionManager.HEADER_NAME, auth);
        logger.info(`${response.dataValues.email} logged in.`);
        res.send(response);
      } else {
        next(errors.invalidUser());
      }
    } else {
      next(errors.invalidUser());
    }
  });
};
