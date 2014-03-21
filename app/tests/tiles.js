'use strict';

var should = require('should'),
    supertest = require('supertest'),
    mongoose = require('mongoose'),
    express = require('express'),
    User = mongoose.model('User'),
    Tile = mongoose.model('Tile');

var tile;
var user;
var app = express();

describe ('<Unit Test>', function () {
  describe('Model Tile:', function() { 
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
        tile = new Tile({
          created: Date.now(),
          name: 'Towelie',
          content: 'Wanna get hai',
          imgUrl: 'www.towelie.com/towel.jpg',
          category: 'Towels',
          comments: []
        });

        done();
      });
     });

    describe('Method Save', function() {
      it('should be able to save tiles without problmem', function(done) {
        return tile.save(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should show an error when content is empty', function(done) {
        tile.content = '';
        return tile.save(function(err) {
          should.exist(err);
          done();
        });
      });
    });

    // Remove items or else they stay in database
    afterEach(function(done) {
      Tile.remove().exec();
      User.remove().exec();
      done();
    });
  });

  describe('HTTP Tiles', function() {
    describe('GET /tiles', function() {
      it ('should respond with json data', function(done) {
        supertest(app)
        .get('/tiles')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      done();
      });
    });

    describe('GET /tiles/categories', function() {
      it('should respond with json data', function(done) {
        supertest(app)
        .get('/tiles/categories')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      done();
      });
    });

    describe('GET /tiles/categories/:categoryName', function() {
      it('should respond with json data', function(done) {
        var categoryName = 'sportsCategory';
        supertest(app)
        .get('/tiles/categories' + categoryName)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      done();
      });
    });
  });
});  