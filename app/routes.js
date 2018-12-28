const users = require('./controllers/users'),
  validation = require('./middlewares/validation'),
  { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post('/users', validation.validateSignup, validation.validateResults, users.create);
  app.get('/users', validation.validateGetUsers, validation.validateResults, users.getAll);
  app.post('/users/sessions', validation.validateSignin, validation.validateResults, users.login);
};
