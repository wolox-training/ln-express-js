'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('albums', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        albumId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      })
      .then(() => {
        queryInterface.addConstraint('albums', ['userId', 'albumId'], {
          type: 'unique'
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('albums');
  }
};
