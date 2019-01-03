const users = require('./controllers/users'),
  validation = require('./middlewares/validation'),
  { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post('/users', validation.validateResults(validation.validateSignup), users.create);
  app.get('/users', validation.validateResults(validation.validateGetUsers), users.getAll);
  app.post('/users/sessions', validation.validateResults(validation.validateSignin), users.login);
};
