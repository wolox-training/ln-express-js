'use strict';

const Config = require('../../app/models').configVariables;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('configVariables', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        value: {
          type: Sequelize.STRING
        },
        oldValue: {
          type: Sequelize.STRING
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      })
      .then(() => {
        Config.createVariable({
          name: 'expiration',
          value: 30
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('configVariables');
  }
};
