const User = require('../models').user,
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs');

exports.create = (req, res, next) =>
  User.createUser(req.body)
    .then(response => {
      res.status(201);
      res.send();
    })
    .catch(next);

exports.getByEmail = (req, res, next) =>
  User.getByEmail(req.query.email)
    .then(email => {
      if (email) {
        res.status(200);
        res.send(email);
      } else {
        next(errors.userNotFound());
      }
    })
    .catch(next);

exports.login = (req, res, next) =>
  User.getByEmail(req.body.email).then(user => {
    if (user) {
      const isValid = bcrypt.compareSync(req.body.password, user.dataValues.password);
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

exports.getAll = (req, res, next) =>
  User.getAll(req.query.limit, req.query.offset).then(response => {
    res.status(200);
    res.send(response);
  });
