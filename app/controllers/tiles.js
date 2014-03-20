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
  var uncrateVices = null;

  Tile.find({category: 'tech'}, function(error, data) {
    sportsCategory = data;
    return sportsCategory;
  });

  Tile.find({category: 'vices'}, function(error, data) {
    uncrateVices = data;
    return uncrateVices;
  });

  Tile.find({category: 'style'}, function(error, data) {
    geekyToysCategory = data;
    res.json([sportsCategory, geekyToysCategory, uncrateVices]);
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
      return page.open('http://uncrate.com/vices/', function(status) {
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

              // thisiswhyiambroke.com images
              // http://www.thisiswhyimbroke.com/new/
              // jQuery('article .item img').each(function() {
              //   var img = getImgDimensions(jQuery(this));
              //   images.push(img);
              // });

              // uncrate.com images
              $('.article-list.grid li .image-wrapper img').each(function() {
                  var img = getImgDimensions($(this));
                  images.push(img);
              });


              // END

              var titleArr = [];
              var contentArr = [];

              // thisiswhyiambroke.com content
              // Get titles
              // jQuery('article h1 a').each(function() {
              //   titleArr.push(jQuery(this)[0].title);
              // });

              // // Get contents
              // jQuery('article .details .desc p').each(function() {
              //   contentArr.push(jQuery(this)[0].innerText);
              // });
              //

              // uncrate.com content
              // Get contents
              $('.article-list.grid li .content-wrapper .copy-wrapper p:first-of-type').each(function() {
                contentArr.push($(this)[0].innerText);
              });

              // Get titles
              $('.article-list.grid li .content-wrapper .copy-wrapper h1 a').each(function() { titleArr.push($(this)[0].text); });

              // Create an array of objects containing titles and contents
              var tilesArr = []
              for(var i = 0; i < titleArr.length; i++) {
                var randomPhotoNumber = Math.floor((Math.random()*100000)+1);

                tilesArr.push({category: 'vices', name: titleArr[i], content: contentArr[i], imgUrl: 'photo' + randomPhotoNumber + '.jpg'});
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
          }, 5000);
        });
      });
    });
  });
  // END
};
