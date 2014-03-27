'use strict';

module.exports = function(app) {
  var tiles = require('../../app/controllers/tiles');

  // This might cause issues with other routes that takes paramater.
  // Get more categories/tiles
  app.post('/tiles/more/:side', tiles.loadmore);

  // Get a list of all tiles
  app.get('/tiles', tiles.list);

  // Update tile's likes count.
  app.put('/tiles/update', tiles.update);

  // GET shared tile, placed in center of other random tiles
  app.get('/tile/shared/:tileId', tiles.shared);

  // GET one tile
  app.get('/tile/:tileId', tiles.show);

  // Create tiles
  app.post('/tiles', tiles.create);

  // GET tiles within a category
  app.get('/tiles/category/:categoryName', tiles.category);

  // GET all categories.
  app.get('/tiles/categories', tiles.categories);
}
