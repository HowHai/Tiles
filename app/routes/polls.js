'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var polls = require('../../app/controllers/polls');

  // // Poll Routes
  // app.get('/polls', polls.list);
  // app.post('/polls', users.requiresLogin, polls.create);
  // app.get('/polls/:pollId', polls.read);
  // app.put('/polls/:pollId', users.requiresLogin, polls.hasAuthorization, polls.update);
  // app.del('/polls/:pollId', users.requiresLogin, polls.hasAuthorization, polls.delete);

  // Finish by binding the poll middleware
  // app.param('pollId', polls.pollByID);
};