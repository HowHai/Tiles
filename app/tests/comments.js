'use strict';

var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('express'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    app = express();

var comment;
var user;

describe ('<Unit Test>', function () {
  describe('Model Comment:', function() { 
    beforeEach(function(done) { 
      user = new User ({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: 'username',
        password: 'password'
      });

      user.save(function() {
        comment = new Comment({
          user: user,
          content: 'Dont comment on me, bro',
          created: Date.now(),
          tile: 'Im a tile'
        });

        done();
      });
     });

    describe('Method Save', function() {
      it('should be able to save comments without problmem', function(done) {
        return comment.save(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should show an error when content is empty', function(done) {
        comment.content = '';
        return comment.save(function(err) {
          should.exist(err);
          done();
        });
      });
    });

    // Remove items or else they stay in database
    afterEach(function(done) {
      Comment.remove().exec();
      User.remove().exec();
      done();
    });
  });

  describe('HTTP Comments', function() {
    describe('GET /comments', function() {
      it ('should response with json', function(done){
        request(app)
        .get('/comments')
        .expect('Content-Type', /json/)
        .expect(200)
      done(); 
      });
    });
  });
});