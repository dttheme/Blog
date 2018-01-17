const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

//GET test
  it('should list blog posts on GET', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body.length).to.be.at.least(1);
      const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
      res.body.forEach(function (item) {
        expect(item).to.include.keys(expectedKeys);
      });
    });
  });

//POST tests
  it('should ad an item on POST', function() {
    const newItem = {title: = 'TestPost', content: 'TestContent', author: 'testAuthor'};
    return chai.request(app)
    .post('/blog-posts')
    .send(newItem)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.include.keys('title', 'content', 'author', 'publishDate', 'id');
      expect(res.body.id).to.not.equal(null);
    });
  });

//PUT test
  it('should update items on PUT', function() {
    const updateData = {
      title: 'PUTtest',
      content: 'PUTcontent',
      author: 'PUTauthor'
    };
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updateData.id = res.body[0].id;
      return chai.request(app)
        .put(`/blog-posts/${updateData.id}`)
        .send(updateData);
    })
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(updateData);
    });
  });

//DELETE test
})
