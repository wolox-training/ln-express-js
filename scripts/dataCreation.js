const User = require('../app/models').user;

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
  return Promise.all(data);
};
