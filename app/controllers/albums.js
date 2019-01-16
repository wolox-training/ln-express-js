const fetch = require('node-fetch'),
  Album = require('../models').album,
  User = require('../models').user,
  sessionManager = require('./../services/sessionManager');

exports.buyAlbum = async (req, res, next) => {
  try {
    let album = '';
    await fetch(`https://jsonplaceholder.typicode.com/albums/${req.params.id}`)
      .then(response => response.json())
      .then(albumRes => {
        album = albumRes;
      });
    const auth = req.headers.authorization;
    const loggedUser = await sessionManager.decode(auth);
    const user = await User.getByEmail(loggedUser.email);

    const newAlbum = {
      albumId: album.id,
      userId: user.id,
      title: album.title
    };
    await Album.createAlbum(newAlbum);

    res.status(200).send(album);
  } catch (err) {
    next(err);
  }
};

exports.getAllAlbums = (req, res, next) => {
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .then(json => {
      res.status(200);
      res.send(json);
    });
};
