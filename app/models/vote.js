'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VoteSchema = new Schema({
  user: {
    type: String
  },
  choice: {
    type: Boolean
  }
});

VoteSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName').exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);