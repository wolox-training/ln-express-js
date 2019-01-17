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
const albumListMock = [
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

const albumMock = {
  userId: 1,
  id: 1,
  title: 'quidem molestiae enim'
};

describe('/albums GET', () => {
  beforeEach(() => {
    nock('https://jsonplaceholder.typicode.com')
      .get('/albums')
      .reply(200, albumListMock);
  });
  it('album listing should be successful', done => {
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
  it('album listing should failed because not logged in', done => {
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

describe('/albums/:id POST', () => {
  beforeEach(() => {
    nock('https://jsonplaceholder.typicode.com')
      .get('/albums/1')
      .reply(200, albumMock);
  });
  it('album buying should be successful', done => {
    successfulLogin().then(loginRes => {
      return chai
        .request(server)
        .post('/albums/1')
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('userId');
          res.body.should.have.property('id');
          res.body.should.have.property('title');
          dictum.chai(res);
        })
        .then(() => done());
    });
  });
  it('same album for different users should be successful', done => {
    const user2 = {
      email: 'email2@wolox.com.ar',
      password: 'wolox1189'
    };
    successfulLogin().then(loginRes => {
      chai
        .request(server)
        .post('/albums/1')
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('userId');
          res.body.should.have.property('id');
          res.body.should.have.property('title');
        });
    });

    nock('https://jsonplaceholder.typicode.com')
      .get('/albums/1')
      .reply(200, albumMock);
    chai
      .request(server)
      .post('/users/sessions')
      .send(user2)
      .then(loginRes2 => {
        chai
          .request(server)
          .post('/albums/1')
          .set(sessionManager.HEADER_NAME, loginRes2.headers[sessionManager.HEADER_NAME])
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('userId');
            res.body.should.have.property('id');
            res.body.should.have.property('title');
          })

          .then(() => done());
      });
  });
  it('album buying should fail because not logged in', done => {
    (async () => {
      await chai
        .request(server)
        .post('/albums/1')
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code', 'unauthorized');
        });
      done();
    })();
  });
  it('same album, same user should fail', done => {
    (async () => {
      await successfulLogin().then(loginRes => {
        chai
          .request(server)
          .post('/albums/1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('userId');
            res.body.should.have.property('id');
            res.body.should.have.property('title');
            dictum.chai(res);
          });
      });
      await successfulLogin().then(loginRes => {
        chai
          .request(server)
          .post('/albums/1')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.should.have.status(503);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code', 'database_error');
          });
      });
      done();
    })();
  });
});