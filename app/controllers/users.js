const User = require('../models').user;

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
    .catch(err => {
      next(err);
    });
};
