const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('../app'),
  assert = require('chai').assert,
  should = chai.should(),
  bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

chai.use(chaiHttp);
describe('/users POST', () => {
  it('should fail because email is missing', done => {
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
  it('should fail because password does not meet requirements', done => {
    const userWithPasswordNotMeetingRequirements = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith3@wolox.com.ar',
      password: 'aa'
    };
    chai
      .request(server)
      .post('/users')
      .send(userWithPasswordNotMeetingRequirements)
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'password_error');
      })
      .then(() => done());
  });
  it('should be succesful', done => {
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
