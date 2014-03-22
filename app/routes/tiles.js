'use strict';

module.exports = function(app) {
  var tiles = require('../../app/controllers/tiles');

  // Get a list of all tiles
  app.get('/tiles', tiles.list);

  // GET one tile
  app.get('/tile/:tileId', tiles.show);

  // Create tiles
  app.post('/tiles', tiles.create);

  // GET tiles within a category
  app.get('/tiles/category/:categoryName', tiles.category);

  // GET all categories.
  app.get('/tiles/categories', tiles.categories);
}
