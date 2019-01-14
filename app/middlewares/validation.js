const errors = require('../errors'),
  User = require('../models').user,
  { check, validationResult } = require('express-validator/check');

exports.validateSignup = [
  check('firstName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters),

  check('lastName')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters),

  check('email')
    .not()
    .isEmpty()
    .withMessage(errors.missingParameters)
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
    .withMessage(errors.missingParameters)
    .isLength({ min: 8 })
    .withMessage(errors.passwordError('Password must be at least 8 characters in length.'))
    .isAlphanumeric()
    .withMessage(errors.passwordError('Password must be alphanumeric'))
];

exports.validateResults = (req, res, next) => {
  const valErrors = validationResult(req);
  if (!valErrors.isEmpty()) {
    const firstError = valErrors.array()[0].msg;
    throw firstError;
  } else {
    next();
  }
};
