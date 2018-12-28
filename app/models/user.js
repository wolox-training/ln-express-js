const errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        is: /^.+@wolox(\.com\.ar|\.co)$/i
      }
    },
    password: {
      type: DataTypes.STRING
    }
  });

  User.associate = function(models) {};
  User.getById = id => {
    return User.findOne({ where: { id } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getAll = (limit = 10, offset = 0) => {
    return User.findAll({ limit, offset }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getOne = email => {
    return User.findOne({ where: email }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.getByEmail = email => {
    return User.getOne({ email });
  };
  User.createUser = user => {
    const passwordRequirements = /^([a-z0-9]{8,})$/.test(user.password);
    if (!passwordRequirements) {
      throw errors.passwordError('Password does not meet the requirements');
    }
    const salt = 10;
    return bcrypt
      .hash(user.password, salt)
      .then(hash => {
        user.password = hash;
        return User.create(user)
          .then(res => {
            logger.info(`User ${user.email} created`);
          })
          .catch(err => {
            throw errors.invalidEmail();
          });
      })
      .catch(err => {
        if (err.internalCode) {
          // If thrown error on previous catch, throw same error.
          throw errors.invalidEmail();
        } else {
          throw errors.encryptionError(err.message);
        }
      });
  };

  return User;
};
