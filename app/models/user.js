const errors = require('../errors'),
  bcrypt = require('bcryptjs');

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
    if (/^([a-z0-9]{8,})$/.test(user.password)) {
      const salt = 10;
      return bcrypt
        .hash(user.password, salt)
        .then(hash => {
          user.password = hash;
          User.create(user).catch(err => {
            throw errors.savingError(err.errors);
          });
        })
        .catch(err => {
          throw errors.defaultError(err);
        });
    } else {
      throw errors.defaultError('Password does not meet the requirements');
    }
  };

  return User;
};
