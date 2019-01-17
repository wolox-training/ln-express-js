const errors = require('../errors'),
  User = require('../models').user,
  Album = require('../models').album,
  { check, validationResult } = require('express-validator/check'),
  sessionManager = require('./../services/sessionManager');

exports.validateSignup = [
  check('firstName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('First name is missing.')),

  check('lastName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Last name is missing.')),

  check('email')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Email is missing.'))
    .isEmail()
    .withMessage(errors.invalidEmail('Invalid email.'))
    .matches(/^.+@wolox(\.com\.ar|\.co)$/i)
    .withMessage(errors.invalidEmail('The email does not belong to a Wolox domain.'))
    .custom(async value => {
      const foundEmail = await User.getByEmail(value);
      return !foundEmail;
    })
    .withMessage(errors.invalidEmail('The email is already in use.')),

  check('password')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Password is missing.'))
    .isLength({ min: 8 })
    .withMessage(errors.passwordError('Password must be at least 8 characters in length.'))
    .isAlphanumeric()
    .withMessage(errors.passwordError('Password must be alphanumeric'))
];

exports.validateAdminSignup = [
  check('firstName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('First name is missing.')),

  check('lastName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Last name is missing.')),

  check('email')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Email is missing.'))
    .isEmail()
    .withMessage(errors.invalidEmail('Invalid email.'))
    .matches(/^.+@wolox(\.com\.ar|\.co)$/i)
    .withMessage(errors.invalidEmail('The email does not belong to a Wolox domain.')),

  check('password')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Password is missing.'))
    .isLength({ min: 8 })
    .withMessage(errors.passwordError('Password must be at least 8 characters in length.'))
    .isAlphanumeric()
    .withMessage(errors.passwordError('Password must be alphanumeric'))
];

exports.validateSignin = [
  check('email')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Email is missing.'))
    .isEmail()
    .withMessage(errors.invalidEmail('Invalid email.'))
    .matches(/^.+@wolox(\.com\.ar|\.co)$/i)
    .withMessage(errors.invalidEmail('The email does not belong to a Wolox domain.')),

  check('password')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters('Password is missing.'))
];

exports.validateListing = [
  check('limit')
    .optional()
    .isInt({ gt: 0 })
    .withMessage(errors.invalidParameters('Limit must be an integer greater than 0.')),
  check('offset')
    .optional()
    .isInt({ gt: -1 })
    .withMessage(errors.invalidParameters('Offset must be an integer greater or equal to 0'))
];

exports.validateAlbumBuying = [
  check('id')
    .isInt({ min: 1, max: 100 })
    .withMessage(errors.invalidParameters('Album Id must be an integer between 1 and 100.'))
    .custom(async (albumId, { req, loc, path }) => {
      const auth = req.headers.authorization;
      const loggedUser = await sessionManager.decode(auth);
      const user = await User.getByEmail(loggedUser.email);
      const userId = user.dataValues.id;
      const foundAlbum = await Album.getOne(albumId, userId);
      return !foundAlbum;
    })
    .withMessage(errors.databaseError(`Can\'t buy same album multiple times.`))
];

exports.validateListAlbums = [
  check('user_id')
    .isInt({ min: 1 })
    .withMessage(errors.invalidParameters('User Id must be a positive integer.'))
    .custom(async (userId, { req, loc, path }) => {
      const auth = req.headers.authorization;
      const loggedUser = await sessionManager.decode(auth);
      const user = await User.getByEmail(loggedUser.email);
      const loggedUserId = user.dataValues.id;
      return user.dataValues.isAdmin || loggedUserId === parseInt(userId);
    })
    .withMessage(errors.unauthorized())
];

exports.validateResults = (...validations) => {
  const allValidations = validations.reduce((accum, value) => [...accum, ...value]);
  const validationsAndResult = allValidations.concat([
    (req, res, next) => {
      const valErrors = validationResult(req);
      if (!valErrors.isEmpty()) {
        return res.json({ errors: valErrors.array() });
      } else {
        next();
      }
    }
  ]);
  return validationsAndResult;
};
