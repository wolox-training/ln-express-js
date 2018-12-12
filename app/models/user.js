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

  User.createUser = user => {
    const passwordRequirements = /^([a-z0-9]{8,})$/.test(user.password);
    if (!passwordRequirements) {
      throw errors.savingError('Password does not meet the requirements');
    }
    const salt = 10;
    return bcrypt
      .hash(user.password, salt)
      .then(hash => {
        user.password = hash;
        User.create(user)
          .then(res => {
            logger.info('User created');
          })
          .catch(err => {
            throw errors.invalidEmail;
          })
          .catch(err => {
            logger.error(err);
          });
      })
      .catch(err => {
        throw errors.defaultError('Error Bcrypt');
      })
      .catch(err => {
        logger.error(err);
      });
  };

  return User;
};
