'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
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

// GET all tiles in all categories and return as an array
exports.categories = function(req, res){
  var sportsCategory = null;
  var geekyToysCategory = null;

  Tile.find({category: 'sports'}, function(error, data) {
    sportsCategory = data;
    return sportsCategory;
  });

  Tile.find({category: 'geekytoys'}, function(error, data) {
    geekyToysCategory = data;
    res.cookie('haiii', "Hai");
    res.json([sportsCategory, geekyToysCategory]);
  });

}

// GET all tiles within a category
exports.category = function(req, res){
  var tilesCategory = req.params.categoryName;

  Tile.find({category: tilesCategory}, function(error, data){
    if (error)
      res.send(error);
    else
      res.json(data);
  })
}

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

              // Get Images
              var images = [];

              function getImgDimensions($i) {
                return {
                  top : $i.offset().top,
                  left : $i.offset().left,
                  width : $i.width(),
                  height : $i.height()
                }
              }

              jQuery('article .item img').each(function() {
                var img = getImgDimensions(jQuery(this));
                images.push(img);
              });
              // END

              var titleArr = [];
              var contentArr = [];

              // Get titles
              jQuery('article h1 a').each(function() {
                titleArr.push(jQuery(this)[0].title);
              });
              console.log(titleArr);

              // Get contents
              jQuery('article .details .desc p').each(function() {
                contentArr.push(jQuery(this)[0].innerText);
              });
              console.log(contentArr);

              // Create an array of objects containing titles and contents
              var tilesArr = []
              for(var i = 0; i < titleArr.length; i++) {
                var randomPhotoNumber = Math.floor((Math.random()*100000)+1);

                tilesArr.push({name: titleArr[i], content: contentArr[i], imgUrl: 'photo' + randomPhotoNumber + '.jpg'});
              }

              return [tilesArr, images];
            }, function(result) {
                // Save pulled images
                result[1].forEach(function(imageObj, index, array){
                  page.set('clipRect', imageObj);
                  page.render('public/modules/tiles/img/tiles/' + result[0][index].imgUrl);
                });

                // Create new tiles using pulled data
                for(var i = 0; i < result[0].length; i++) {

                  var tile = new Tile(result[0][i]);

                  tile.save();
                }
                ph.exit();
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
