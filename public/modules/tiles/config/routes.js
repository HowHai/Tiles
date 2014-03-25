'use strict';

angular.module('mean.tiles').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('haihome', {
      url: '/',
      templateUrl: 'modules/tiles/views/show.html',
      controller: 'TilesCtrl'
    }).
    state('showTile', {
      url: '/fsfs',
      templateUrl: 'modules/tiles/views/show.html',
      controller: 'TilesCtrl'
    }).state('explodedTiles', {
      url: '/exploded',
      templateUrl: 'modules/tiles/views/index.html',
      controller: 'TilesCtrl'
    });
  }
]);