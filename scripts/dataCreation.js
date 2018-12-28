const User = require('../app/models').user;

exports.execute = () => {
  const data = [];
  for (let i = 1; i <= 3; i++) {
    // eslint-disable-next-line prefer-const
    let user = {
      firstName: `firstName${i}`,
      lastName: `lastName${i}`,
      email: `email${i}@wolox.com.ar`,
      password: `wolox1189`
    };
    data.push(User.createUser(user));
  }
  return Promise.all(data);
};
