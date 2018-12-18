const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should();

chai.use(chaiHttp);
describe('/users POST', () => {
  it('should fail because email is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        password: 'password'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'invalid_email');
      })
      .then(() => done());
  });
  it('should fail because password does not meet requirements', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@wolox.com.ar',
        password: '@#'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'saving_error');
      })
      .then(() => done());
  });
  it('should be succesful', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@wolox.com.ar',
        password: 'wolox1189'
      })
      .then(res => {
        res.should.have.status(201);
        dictum.chai(res);
      })
      .then(() => done());
  });
  it('should failed because repeated email', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@wolox.com.ar',
        password: 'wolox1189'
      })
      .then(res => {
        res.should.have.status(201);
      });
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@wolox.com.ar',
        password: 'wolox1189'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code', 'invalid_email');
      })
      .then(() => done());
  });
});
