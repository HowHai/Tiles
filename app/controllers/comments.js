'use strict';

var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  Tile = mongoose.model('Tile'),
  User = mongoose.model('User'),
  _ = require('lodash');

// Create comment
exports.create = function(req, res) {
  var comment = new Comment(req.body);
  comment.user = req.user;

  console.log(comment);

  comment.save(function(err, comment) {
    if (err) {
      console.log(err);
      return res.send('users/signup', {
        errors: err.errors,
        comment: comment
      });
    } else {
      Tile.findById(comment.tile, function(err, tile) {
        console.log(tile);
        console.log(comment._id);
        tile.comments.push(comment._id);
        tile.save(function(tile){
          res.json(tile);
        });
      });
    }
  });
};

// Show current comment
exports.read = function(req, res) {
  res.jsonp(req.comment);
};

// Delete a comment
exports.delete = function(req, res) {
  var comment = req.comment;

  comment.remove(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(comment);
    }
  });
};

// List of comments
exports.list = function(req, res) {
  Comment.find().populate('user', 'displayName').exec(function(err, comments) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(comments);
    }
  });
};

  // Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {

// Comment middleware
exports.commentByID = function(req, res, next, id) {
  Comment.load(id, function(err, comment) {
    if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment ' + id));
    req.comment = comment;
    next();
  });
};

// Comment authorization middleware
exports.hasAuthorization = function(req, res, next) {
  if (req.comment.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next ();
};
