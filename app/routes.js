const users = require('./controllers/users'),
  albums = require('./controllers/albums'),
  validation = require('./middlewares/validation'),
  { check, validationResult } = require('express-validator/check'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', validation.validateResults(validation.validateSignup), users.create);
  app.post(
    '/admin/users',
    auth.secure,
    auth.checkAdmin,
    validation.validateResults(validation.validateAdminSignup),
    users.createAdmin
  );
  app.get('/users', auth.secure, validation.validateResults(validation.validateListing), users.getAll);
  app.post('/users/sessions', validation.validateResults(validation.validateSignin), users.login);
  app.get(
    '/users/:user_id/albums',
    auth.secure,
    validation.validateResults(validation.validateListing, validation.validateListAlbums),
    users.getBoughtAlbums
  );
  app.get(
    '/users/albums/:id/photos',
    auth.secure,
    validation.validateResults(validation.validateListPhotos),
    albums.getAllPhotos
  );
  app.get('/albums', auth.secure, albums.getAllAlbums);
  app.post(
    '/albums/:id',
    auth.secure,
    validation.validateResults(validation.validateAlbumBuying),
    albums.buyAlbum
  );
};
