const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('../app'),
  assert = require('chai').assert,
  should = chai.should(),
  bcrypt = require('bcryptjs'),
  User = require('../app/models').user,
  sessionManager = require('./../app/services/sessionManager');

const successfulLogin = () => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: 'wolox1189' });
};

chai.use(chaiHttp);
describe('/users POST', () => {
  it('registration should fail because email is missing', done => {
    const userWithoutEmail = {
      firstName: 'John',
      lastName: 'Smith',
      password: 'password'
    };
    chai
      .request(server)
      .post('/users')
      .send(userWithoutEmail)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'missing_parameters');
      })
      .then(() => done());
  });
  it('registration should fail because password does not meet requirements', done => {
    const userWithInvalidPassword = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith3@wolox.com.ar',
      password: 'aa'
    };
    chai
      .request(server)
      .post('/users')
      .send(userWithInvalidPassword)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'password_error');
      })
      .then(() => done());
  });
  it('registration should be succesful', done => {
    const sampleUser = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@wolox.com.ar',
      password: 'wolox1189'
    };
    chai
      .request(server)
      .post('/users')
      .send(sampleUser)
      .then(res => {
        res.should.have.status(201);
        return User.getByEmail(sampleUser.email).then(response => {
          response.dataValues.should.have.property('firstName', sampleUser.firstName);
          response.dataValues.should.have.property('lastName', sampleUser.lastName);
          response.dataValues.should.have.property('email', sampleUser.email);
          assert(bcrypt.compareSync(sampleUser.password, response.dataValues.password));
          dictum.chai(res);
        });
      })
      .then(done)
      .catch(done);
  });
  it('should failed because repeated email', done => {
    const sampleUser = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@wolox.com.ar',
      password: 'wolox1189'
    };
    chai
      .request(server)
      .post('/users')
      .send(sampleUser)
      .then(res => {
        res.should.have.status(201);
      });
    chai
      .request(server)
      .post('/users')
      .send(sampleUser)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'invalid_email');
      })
      .then(() => done());
  });
});

describe('/user/sessions POST', () => {
  it('login should be a succesful', done => {
    const sampleUser = { email: 'email1@wolox.com.ar', password: 'wolox1189' };
    chai
      .request(server)
      .post('/users/sessions')
      .send(sampleUser)
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        res.body.should.have.property('email');
        res.body.should.have.property('password');
        res.headers.should.have.property(sessionManager.HEADER_NAME);
        const resEmail = sessionManager.decode(res.headers.authorization).email;
        assert(sampleUser.email === resEmail);
        dictum.chai(res);
      })
      .then(() => done());
  });
  it('login should fail because of invalid username', done => {
    const invalidUserEmail = { email: 'invalidemail@wolox.com.ar', password: 'wolox1189' };
    chai
      .request(server)
      .post('/users/sessions')
      .send(invalidUserEmail)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'invalid_user');
      })
      .then(() => done());
  });
  it('login should fail because of invalid password', done => {
    const invalidUserPassword = { email: 'email1@wolox.com.ar', password: 'invalidPassword' };
    chai
      .request(server)
      .post('/users/sessions')
      .send(invalidUserPassword)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'invalid_user');
      })
      .then(() => done());
  });
  it('login should fail because of missing password', done => {
    const invalidUserNoPassword = { email: 'email1@wolox.com.ar' };
    chai
      .request(server)
      .post('/users/sessions')
      .send(invalidUserNoPassword)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'missing_parameters');
      })
      .then(() => done());
  });
  it('login should fail because of missing email', done => {
    const invalidUserNoEmail = { password: 'invalidPassword' };
    chai
      .request(server)
      .post('/users/sessions')
      .send(invalidUserNoEmail)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'missing_parameters');
      })
      .then(() => done());
  });
});
