const User = require('../app/models').user,
  Album = require('../app/models').album,
  Config = require('../app/models').configVariables;

exports.execute = async () => {
  const data = [];
  for (let i = 1; i <= 3; i++) {
    // eslint-disable-next-line prefer-const
    let user = {
      firstName: `firstName${i}`,
      lastName: `lastName${i}`,
      email: `email${i}@wolox.com.ar`,
      password: `wolox1189`
    };
    // eslint-disable-next-line no-await-in-loop
    data.push(await User.createUser(user));
  }
  const adminUser = {
    firstName: `AdminTest`,
    lastName: `AdminTest`,
    email: `admin@wolox.com.ar`,
    password: `wolox1189`,
    isAdmin: true
  };
  data.push(await User.createUser(adminUser));

  const newAlbum1 = {
    albumId: 11,
    userId: 1,
    title: 'quam nostrum impedit mollitia quod et dolor'
  };
  const newAlbum2 = {
    albumId: 12,
    userId: 1,
    title: 'consequatur autem doloribus natus consectetur'
  };

  const expiration = {
    name: 'expiration',
    value: '10'
  };

  data.push(await Album.createAlbum(newAlbum1));
  data.push(await Album.createAlbum(newAlbum2));
  data.push(await Config.createVariable(expiration));
  return Promise.all(data);
};
