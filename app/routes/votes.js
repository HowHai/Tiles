'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var votes = require('../../app/controllers/votes');

  // votes Routes
  app.get('/votes', votes.list, function(req, res){
    return res.send(200);
  });
  app.post('/votes', users.requiresLogin, votes.create);
  app.get('/votes/:voteId', votes.read);
  app.del('/votes/:voteId', users.requiresLogin, votes.hasAuthorization, votes.delete);

  // Bind vote middleware
  app.param('voteId', votes.voteByID);
};