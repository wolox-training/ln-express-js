const fetch = require('node-fetch');

exports.getAllAlbums = (req, res, next) => {
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .then(json => {
      res.status(200);
      res.send(json);
    });
};
