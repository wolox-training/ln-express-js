const User = require('../models').user,
  errors = require('../errors');

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
