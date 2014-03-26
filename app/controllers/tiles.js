'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  Tile = mongoose.model('Tile'),
  Vote = mongoose.model('Vote'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category'),
  _ = require('lodash'),
  phantom = require('phantom');

// Get a tile
exports.show = function(req, res){
  var tileId = req.params.tileId;
  Tile.findById(tileId, function(error, tile) {
    if(error)
      console.log(error);
    else
      res.json(tile);
  });
};

// Update a tile's likes count.
exports.update = function(req, res){
  var tileId = req.body.tileId;
  console.log(req.body.tileId);

  Tile.update({_id: tileId}, { $inc: { likes: 1 } }, function(error, doc){
    Tile.findById(tileId, function(error, data){
      res.json(data);
    });

  });
}

// GET shared tile, placed in center of other random tiles
exports.shared = function(req, res){
  var sharedTileId = req.params.tileId;
  console.log("shared: " + req.params.tileId);

  Tile.findById(sharedTileId, function(error, sharedTile) {
    if(error)
      console.log(error);
    else
      // Return shared tile in center
      Category.find({},{}).populate({path: 'tiles', match: { _id: { $ne: sharedTile._id }} }).exec(function(error, categories) {
        // Populate comments data within each tile.
        Tile.populate(categories, {
          path: 'tiles.comments',
          model: Comment,
        }, function(error, categories) {
          // Populate user data within each comment.
          Comment.populate(categories, {
            path: 'tiles.comments.user',
            select: 'displayName',
            model: User
          }, function(error, categories) {
            // Return each category with tiles inside as an array. [[cat1], [cat2]]
            var categoriesArray = categories.map(function(cat) { return cat.tiles });

            // Find category of sharedTile.
            var categoryIndex;
            categoriesArray.forEach(function(cat, index){
              if (cat[0].category == sharedTile.category)
                categoryIndex = index;
            });

            // Add shared tile to center of its category.
            categoriesArray[categoryIndex].splice(9, 0, sharedTile);

            // Swap sharedTile's category to center of categories array.
            var categoryCenter = Math.round((categoriesArray.length / 2) - 1);
            var centeredCategoriesArray = categoriesArray.move(categoryIndex, categoryCenter);

            // res.json(categoryIndex)
            res.json(centeredCategoriesArray);
          });
        });
      });
  });
};

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
  // TODO: Errors handling

  // TODO: Uncomment this after done with testing.
  // if(req.cookies.savedTiles){
  if(false){
    var tilesArray = JSON.parse(req.cookies.savedTiles)
    var savedTilesArray = [];

    // Populate all savedTiles into two dimensional array.
    for(var i = 0; i < tilesArray.length; i++) {
      Tile.find({_id: { $in: tilesArray[i]} }).populate('comments').exec(function(error, tiles) {
        Comment.populate(tiles, {
          path: 'comments.user',
          select: 'displayName',
          model: User
        }, function(error, tiles) {
          savedTilesArray.push(tiles);

          if(savedTilesArray.length == tilesArray.length) {
            // console.log(savedTilesArray);
            res.json(savedTilesArray);
          }
        });
      });
    }
  } else {
    // Find all categories and populate tiles data within category.
    Category.find({}, { tiles: 1, _id: 0 }).populate('tiles').exec(function(error, categories) {
      // Populate comments data within each tile.
      Tile.populate(categories, {
        path: 'tiles.comments',
        model: Comment,
      }, function(error, categories) {
        // Populate user data within each comment.
        Comment.populate(categories, {
          path: 'tiles.comments.user',
          select: 'displayName',
          model: User
        }, function(error, categories) {

          // Return each category with tiles inside as an array. [[cat1], [cat2]]
          var categoriesArray = categories.map(function(cat) { return shuffle(cat.tiles) });
          // var categoriesArray = categories.map(function(cat) { return cat.tiles });

          // Get all tiles'ID and push to new array.
          var allTilesId = [];
          for(var i = 0; i < categoriesArray.length; i++) {
            var getTilesId = categoriesArray[i].map(function(tilee) {
              return tilee._id;
            });
            allTilesId.push(getTilesId);
          }
          // Store user's grid to cookie.
          res.cookie("savedTiles", JSON.stringify(allTilesId));

          // Randomize category
          categoriesArray = shuffle(categoriesArray);
          // categoriesArray = (categoriesArray);
          res.json(categoriesArray);
        });
      });
    });
  }
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
      return page.open("http://uncrate.com/food/", function(status) {
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

                tilesArr.push({category: "Food", name: titleArr[i], content: contentArr[i], imgUrl: 'photo' + randomPhotoNumber + '.jpg'});
              }

              return [tilesArr, images];
            }, function(result) {
                // Save pulled images
                result[1].forEach(function(imageObj, index, array){
                  page.set('clipRect', imageObj);
                  page.render('public/modules/tiles/img/tiles/' + result[0][index].imgUrl);
                });

                // Find category. Create new one if none exist.
                var categoryName = "Food";

                Category.findOne({name: categoryName}, function(error, cat){
                  if (cat === null) {
                    console.log(error);
                    console.log(cat);
                    var category = new Category({name: categoryName});
                    makeTiles(result, category);
                  } else {
                    console.log("This ran");
                    var category = cat;
                    makeTiles(result, category);
                  }
                });

                // Create new tiles using pulled data
                var makeTiles = function(result, category) {
                  for(var i = 0; i < result[0].length; i++) {

                    var tile = new Tile(result[0][i]);

                    console.log(category);
                    category.tiles.push(tile);
                    category.save();

                    tile.save();
                  }
                  ph.exit();
                }
            });
          }, 5000);
        });
      });
    });
  });
  // END
};

// MISC.
// Array method to swap old_index with new_index
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

// Function to shuffle an array
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
