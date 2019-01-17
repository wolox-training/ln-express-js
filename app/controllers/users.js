const User = require('../models').user,
  Album = require('../models').album,
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs'),
  fetch = require('node-fetch');

exports.create = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false
      }
    : {};
  User.createUser(user)
    .then(response => {
      res.status(201);
      res.send();
    })
    .catch(next);
};

exports.createAdmin = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        isAdmin: true
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

exports.getAll = (req, res, next) => {
  const searchParameters = req.query
    ? {
        limit: req.query.limit,
        offset: req.query.offset
      }
    : {};
  return User.getAll(searchParameters.limit, searchParameters.offset).then(response => {
    res.status(200);
    res.send(response);
  });
};

exports.getBoughtAlbums = (req, res, next) => {
  return Album.getAll(req.params.user_id, req.query.limit, req.query.offset).then(response => {
    res.status(200);
    res.send(response);
  });
};
