'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: {
    type: String
  },
  tile: {
    type: String
  },
  content: {
    type: String,
    default: '',
  },
  created: {
    type: Date, 
    default: Date.now
  }
});

CommentSchema.path('content').validate(function(content) {
  return content.length;
}, 'Comment cannot be blank');

CommentSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName', 'tile').exec(cb);
  }
};

mongoose.model('Comment', CommentSchema);
