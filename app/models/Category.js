'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {type: String},
  tiles: [{type: Schema.Types.ObjectId, ref: 'Tile'}]
})

mongoose.model('Category', CategorySchema);
