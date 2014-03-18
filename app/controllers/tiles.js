'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Tile = mongoose.model('Tile'),
  _ = require('lodash'),
  phantom = require('phantom');

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
  // PhantomJS testt
    phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open('http://www.thisiswhyimbroke.com/new/', function(status) {
        console.log('opened site?', status);

        page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
          setTimeout(function() {
            return page.evaluate(function() {

              var titleArr = [];
              var contentArr = [];

              titleArr.push(jQuery('article h1 a')[0].text);
              contentArr.push(jQuery('article .details .desc p')[0].innerText);

              return {name: titleArr[0], content: contentArr[0], imgUrl: 'photo1.jpg'};
            }, function(result) {

                var tile = new Tile(result);

                tile.save(function(error, data) {
                  if (error)
                    res.send(error);
                  else
                    res.json(data); // Return created tile object
                });
            });
          }, 1000);
        });
      });
    });
  });
  // END
};

// Return random tile object
var randomTileObject = function() {
  var names = ['Cat Burger Pillow', '3D Printed Ultrasound Baby', 'Solar System 3D Wall Art', 'Ping Pong Door', 'Floating Putting'];

  var randomName = names[Math.floor(Math.random() * names.length)];

  // Random length of contents
  var content = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  var contentLength = Math.floor((Math.random()*(content.length - 100))+1);

  var truncatedContent = content.substring(0, contentLength);

  // Only 8 photos available currently
  var randomPhotoNumber = Math.floor((Math.random()*7)+1);
  var randomImgUrl = "photo" + randomPhotoNumber + ".jpg"

  return {name: randomName, content: truncatedContent, imgUrl: randomImgUrl};
}

var scrapContent = function() {
  // Scrap image
  // phantom.create(function(ph) {
  //   return ph.createPage(function(page) {
  //     return page.open(siteUrl, function(status) {
  //       console.log('page loaded:', status);

  //       page.render('public/modules/tiles/img/twitter.png');
  //       ph.exit();
  //     });
  //   });
  // });

  // Scrape content
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open('http://www.thisiswhyimbroke.com/new/', function(status) {
        console.log('opened site?', status);

        page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
          setTimeout(function() {
            return page.evaluate(function() {

              var titleArr = [];
              var contentArr = [];

              titleArr.push(jQuery('article h1 a')[0].text);
              contentArr.push(jQuery('article .details .desc p')[0].innerText);

              return {name: titleArr[0], content: contentArr[0], imgUrl: 'photo1.jpg'};
            }, function(result) {console.log(result);});
          }, 1000);
        });
      });
    });
  });
}
