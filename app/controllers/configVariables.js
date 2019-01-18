const ConfigVariables = require('../models').configVariables,
  errors = require('../errors');

exports.create = (req, res, next) => {
  const variable = req.body
    ? {
        name: req.body.name,
        value: req.body.value
      }
    : {};
  ConfigVariables.createVariable(variable)
    .then(response => {
      res.status(201);
      res.send(response);
    })
    .catch(next);
};

exports.getByName = (req, res, next) => {
  return ConfigVariables.getByName(req.query.name)
    .then(variable => {
      if (variable) {
        res.status(200);
        res.send(variable);
      } else {
        next(errors.userNotFound());
      }
    })
    .catch(next);
};

exports.getAll = (req, res, next) => {
  const searchParameters = req.query
    ? {
        limit: req.query.limit,
        offset: req.query.offset
      }
    : {};
  return ConfigVariables.getAll(searchParameters.limit, searchParameters.offset).then(response => {
    res.status(200);
    res.send(response);
  });
};
