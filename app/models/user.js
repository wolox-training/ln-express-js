const errors = require('../errors');

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
      // TODO: Create database error
      throw Error(err.message);
    });
  };

  User.createUser = user => {
    return User.create(user).catch(err => {
      // TODO: New User error
      throw Error(err.message);
    });
  };

  return User;
};
