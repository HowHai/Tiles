'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    console.log("Sexy Man");
    // Show one tile on page load
    $http.get('/tiles', null)
      .success(function(response) {
        // Get first tile
        console.log(response);
        // $scope.tile = response[0];
        $scope.tileMain = response[0];
        $scope.tileTop = response[1];
        $scope.tileLeft = response[2];
        $scope.tileRight = response[3];
        $scope.tileBottom = response[4];
        $scope.tiles = response;
      })

    // Create a random tile and save to database
    $scope.createTile = function() {
      $http.get('/tilesnew', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }

  }
]);
