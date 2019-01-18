const errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger');

module.exports = (sequelize, DataTypes) => {
  const ConfigVariables = sequelize.define('configVariables', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oldValue: {
      type: DataTypes.STRING
    }
  });

  ConfigVariables.associate = function(models) {};
  ConfigVariables.getById = id => {
    return ConfigVariables.findOne({ where: { id } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  ConfigVariables.getAll = (limit = 10, offset = 0) => {
    return ConfigVariables.findAll({ limit, offset }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  ConfigVariables.getOne = name => {
    return ConfigVariables.findOne({ where: { name } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  ConfigVariables.getByName = name => {
    return ConfigVariables.getOne({ name });
  };
  ConfigVariables.createVariable = variable => {
    return ConfigVariables.getOne(variable.name)
      .then(foundVariable => {
        variable.oldValue = foundVariable.value;
        ConfigVariables.update(variable, { where: { name: variable.name } });
        logger.info(`Variable ${variable.name} modified with value ${variable.value}`);
      })
      .catch(err => {
        ConfigVariables.create(variable);
        logger.info(`Variable ${variable.name} created with value ${variable.value}`);
      });
  };

  return ConfigVariables;
};
