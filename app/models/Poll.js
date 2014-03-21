'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var voteSchema = new Schema({ ip: 'String'});
var choiceSchema = new Schema({
  text: String,
  votes: [voteSchema]
});

exports.PollSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  choices: [choiceSchema]
});