'use strict';

angular.module('mean.tiles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('showTile', {
      url: '/',
      templateUrl: 'modules/tiles/views/home.html',
      controller: 'TilesCtrl'
    }).state('explodedTiles', {
      url: '/exploded',
      templateUrl: 'modules/tiles/views/index.html',
      controller: 'TilesCtrl'
    });
  }
]);

//Setting up route
// angular.module('mean.articles').config(['$stateProvider',
//   function($stateProvider) {
//     // Articles state routing
//     $stateProvider.
//     state('listArticles', {
//       url: '/articles',
//       templateUrl: 'modules/articles/views/list.html'
//     }).
//     state('createArticle', {
//       url: '/articles/create',
//       templateUrl: 'modules/articles/views/create.html'
//     }).
//     state('viewArticle', {
//       url: '/articles/:articleId',
//       templateUrl: 'modules/articles/views/view.html'
//     }).
//     state('editArticle', {
//       url: '/articles/:articleId/edit',
//       templateUrl: 'modules/articles/views/edit.html'
//     });
//   }
// ]);
