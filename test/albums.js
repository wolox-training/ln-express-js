const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('../app'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  bcrypt = require('bcryptjs'),
  User = require('../app/models').user,
  sessionManager = require('./../app/services/sessionManager'),
  nock = require('nock');

const successfulLogin = () => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: 'wolox1189' });
};

chai.use(chaiHttp);
const mockedResponse = [
  {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  },
  {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  },
  {
    userId: 1,
    id: 3,
    title: 'omnis laborum odio'
  },
  {
    userId: 1,
    id: 4,
    title: 'non esse culpa molestiae omnis sed optio'
  }
];

describe('/albums GET', () => {
  beforeEach(() => {
    nock('https://jsonplaceholder.typicode.com')
      .get('/albums')
      .reply(200, mockedResponse);
  });
  it('should be successful', done => {
    successfulLogin().then(loginRes => {
      return chai
        .request(server)
        .get('/albums')
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          assert(res.body.length === 4, 'length of array is 4');
          res.body[0].should.have.property('userId');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('title');
          dictum.chai(res);
        })
        .then(() => done());
    });
  });
  it('should failed because not logged in', done => {
    (async () => {
      await chai
        .request(server)
        .get('/albums')
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code', 'unauthorized');
        });
      done();
    })();
  });
});
