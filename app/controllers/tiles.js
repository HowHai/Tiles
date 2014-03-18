'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Tile = mongoose.model('Tile'),
  _ = require('lodash');

// Get list of all tiles
exports.list = function(req, res){
  Tile.find(function(error, data) {
    if (error)
      res.send(error);
    else
      res.json(data);
  });
};

// Create tile
exports.create = function(req, res){
  // Create a random tile from seed data
  var tile = new Tile(randomTileObject());

  tile.save(function(error, data) {
    if (error)
      res.send(error);
    else
      res.json(data);
  });
};

// Return random tile object
var randomTileObject = function() {
  var randomName = ['Cat Burger Pillow', '3D Printed Ultrasound Baby', 'Solar System 3D Wall Art', 'Ping Pong Door', 'Floating Putting'];

  // Random length of contents
  var contentLength = Math.floor((Math.random()*(content.length - 100))+1);

  var content = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  var truncatedContent = content.substring(0, contentLength);

  var randomPhotoNumber = Math.floor((Math.random()*10)+1);
  var randomImgUrl = "photo" + randomPhotoNumber + ".jpg"

  return {name: randomName, content: truncatedContent, imgUrl: randomImgUrl};
}
