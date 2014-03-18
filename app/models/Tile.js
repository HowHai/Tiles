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
  imgUrl: {type: String}
});

mongoose.model('Tile', TileSchema);
