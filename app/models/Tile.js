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
  comments: [],
});

TileSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName', 'comments').exec(cb);
  }
};

mongoose.model('Tile', TileSchema);
