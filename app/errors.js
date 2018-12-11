const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = internalError('Invalid username or password', exports.INVALID_USER);
