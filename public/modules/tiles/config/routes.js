'use strict';

angular.module('mean.tiles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('showTile', {
      url: '/',
      templateUrl: 'modules/tiles/views/haihome.html',
      controller: 'TilesCtrl'
    }).
    state('haiHome', {
      url: '/haihome',
      templateUrl: 'modules/tiles/views/haihome.html',
      controller: 'TilesCtrl'
    }).state('explodedTiles', {
      url: '/exploded',
      templateUrl: 'modules/tiles/views/index.html',
      controller: 'TilesCtrl'
    });
  }
]);
