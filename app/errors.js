const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.INVALID_EMAIL = 'invalid_email';
exports.invalidEmail = (message = 'Invalid email, may be repeated or not belonging to a Wolox domain') =>
  internalError(message, exports.INVALID_EMAIL);

exports.PASSWORD_ERROR = 'password_error';
exports.passwordError = (message = 'Password error') => internalError(message, exports.PASSWORD_ERROR);

exports.MISSING_PARAMETERS = 'missing_parameters';
exports.missingParameters = (message = 'Required parameters are missing') =>
  internalError(message, exports.MISSING_PARAMETERS);

exports.INVALID_PARAMETERS = 'invalid_parameters';
exports.invalidParameters = (message = 'parameters are invalid') =>
  internalError(message, exports.INVALID_PARAMETERS);

exports.USER_NOT_FOUND = 'user_not_found';
exports.userNotFound = (message = 'User not found') => internalError(message, exports.USER_NOT_FOUND);

exports.ENCRYPTION_ERROR = 'encryption_error';
exports.encryptionError = (message = 'Encryption error') => internalError(message, exports.ENCRYPTION_ERROR);

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = (message = 'Invalid username or password') =>
  internalError(message, exports.INVALID_USER);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = (message = 'Saving error') => internalError(message, exports.SAVING_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = (message = 'Database error') => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = (message = 'Error') => internalError(message, exports.DEFAULT_ERROR);
