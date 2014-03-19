'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    // Show one tile on page load
    $http.get('/tiles', null)
      .success(function(response) {
        // Get first tile
        $scope.tile = response[response.length-1];
      })

    // Create a random tile and save to database
    $scope.createTile = function() {
      $http.post('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }
  }
]);
