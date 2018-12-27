const User = require('../app/models').user;

exports.execute = () => {
  const data = [];
  data.push(
    User.createUser({
      firstName: 'firstName1',
      lastName: 'lastName1',
      email: 'email1@wolox.com.ar',
      password: 'wolox1189'
    })
  );
  data.push(
    User.createUser({
      firstName: 'firstName2',
      lastName: 'lastName2',
      email: 'email2@wolox.com.ar',
      password: 'wolox1189'
    })
  );
  data.push(
    User.createUser({
      firstName: 'firstName3',
      lastName: 'lastName3',
      email: 'email3@wolox.com.ar',
      password: 'wolox1189'
    })
  );
  return Promise.all(data);
};
