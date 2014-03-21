'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TileSchema = new Schema({
  created: {type: Date, default: Date.now},
  name: {type: String},
  content: {type: String},
  imgUrl: {type: String},
  category: {type: String},
  comments: [],
  votes: []
});

TileSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName', 'comments', 'votes').exec(cb);
  }
};

TileSchema.path('content').validate(function(content) {
  return content.length;
}, 'content cannot be blank');


mongoose.model('Tile', TileSchema);
