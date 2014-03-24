'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VoteSchema = new Schema({
  choice: {
    type: String
  },
  tile: {
    type: String
  }
});

VoteSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName', 'tile').exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);