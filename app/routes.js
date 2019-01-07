const users = require('./controllers/users'),
  validation = require('./middlewares/validation'),
  { check, validationResult } = require('express-validator/check'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', validation.validateResults(validation.validateSignup), users.create);
  app.get('/users', auth.secure, validation.validateResults(validation.validateGetUsers), users.getAll);
  app.post('/users/sessions', validation.validateResults(validation.validateSignin), users.login);
};
