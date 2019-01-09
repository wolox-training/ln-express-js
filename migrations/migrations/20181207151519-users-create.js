'use strict';

const User = require('../../app/models').user;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: Sequelize.STRING
        },
        isAdmin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      })
      .then(() => {
        User.createUser({
          firstName: 'Admin',
          lastName: 'Admin',
          email: 'admin@wolox.com.ar',
          password: 'wolox1189',
          isAdmin: true
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
