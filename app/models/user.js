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
        isEmail: true
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
      throw Error('Invalid ID');
    });
  };

  return User;
};
