'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var comments = require('../../app/controllers/comments');

  // Comments Routes
  app.get('/comments', comments.list, function(req, res){
    return res.send(200);
  });
  app.post('/comments', users.requiresLogin, comments.create);
  app.get('/comments/:commentId', comments.read);
  app.del('/comments/:commentId', users.requiresLogin, comments.hasAuthorization, comments.delete);

  // Bind comment middleware
  app.param('commentId', comments.commentByID);
};