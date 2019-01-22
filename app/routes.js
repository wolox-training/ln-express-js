const users = require('./controllers/users'),
  validation = require('./middlewares/validation'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', validation.signUpValidation, users.create);
  app.get('/users', auth.secure, validation.getUsersValidation, users.getAll);
  app.post('/users/sessions', validation.signInValidation, users.login);
};
