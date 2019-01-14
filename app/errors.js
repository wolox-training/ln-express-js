const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.INVALID_EMAIL = 'invalid_email';
exports.invalidEmail = internalError(
  'Invalid email, may be repeated or not belonging to a Wolox domain',
  exports.INVALID_EMAIL
);

exports.ENCRYPTION_ERROR = 'encryption_error';
exports.encryptionError = message => internalError(message, exports.ENCRYPTION_ERROR);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
