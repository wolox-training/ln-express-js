const users = require('./controllers/users'),
  validation = require('./middlewares/validation'),
  { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post('/users', validation.validateSignup, validation.validateResults, users.create);
  app.get('/users', users.getByEmail);
  app.post('/users/sessions', validation.validateSignin, validation.validateResults, users.login);
};
