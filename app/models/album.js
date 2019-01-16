const errors = require('../errors'),
  logger = require('../logger');

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('album', {
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  });

  Album.associate = models => {
    Album.belongsTo(models.User);
  };

  Album.associate = function(models) {};
  Album.createAlbum = album => {
    return Album.create(album)
      .then(res => {
        logger.info(`Album ${res.dataValues.title} bought by user id ${res.dataValues.userId}`);
      })
      .catch(err => {
        throw errors.databaseError(err.message);
      });
  };
  Album.getAll = (userId, limit = 10, offset = 0) => {
    return Album.findAll({ limit, offset, where: userId }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  return Album;
};
