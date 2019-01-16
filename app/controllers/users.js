const User = require('../models').user,
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs');

exports.create = (req, res, next) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  };
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
  const userRequested = {
    email: req.body.email,
    password: req.body.password
  };
  User.getByEmail(userRequested.email).then(user => {
    if (user) {
      const isValid = bcrypt.compareSync(userRequested.password, user.dataValues.password);
      if (isValid) {
        const auth = sessionManager.encode({ email: user.dataValues.email });

        res.status(200);
        res.set(sessionManager.HEADER_NAME, auth);
        logger.info(`${user.dataValues.email} logged in.`);
        res.send(user);
      } else {
        next(errors.invalidUser());
      }
    } else {
      next(errors.invalidUser());
    }
  });
};

exports.getAll = (req, res, next) => {
  const searchParameters = {
    limit: req.query.limit,
    offset: req.query.offset
  };
  return User.getAll(searchParameters.limit, searchParameters.offset).then(response => {
    res.status(200);
    res.send(response);
  });
};
